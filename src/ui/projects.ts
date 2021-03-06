import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { nanoid } from 'nanoid'
import qs from 'qs'
import { get, writable } from 'svelte/store'
import { ExportProductRequest, ExportProductResponse, Pack, Product, Project } from '../types'
import { active, fetchHeaders, selectedCharacter, selectedProduct } from './app'
import { defaultPack, defaultPreferences, defaultProject } from './constants'
import { viewProduct } from './products'
import { createStore } from './store'
import { getActiveTab } from './tabs'

export const projects = createStore<Project>('projects')

export const downloading = writable({ total: 0, complete: 0, zip: 0 })

export function createProject(name: string) {
  const project: Project = defaultProject(name)

  projects.set(project)

  active.update((s) => ({ ...s, projectId: project.id }))
}

export function removeProject(project: Project) {
  active.update((s) => ({ ...s, projectId: null, editProject: false }))

  projects.remove(project)
}

export function createPack(project: Project, name: string) {
  const character = get(selectedCharacter)

  if (project && character) {
    const pack: Pack = defaultPack(name, character)

    project.packs = { ...project.packs, [pack.id]: pack }

    active.update((s) => ({ ...s, packId: pack.id, productId: pack.products[0]?.id }))

    viewProduct(pack.products[0])

    return pack
  }
}

export function duplicatePack(project: Project, pack: Pack, name: string) {
  const duplicated = {
    ...pack,
    id: nanoid(),
    name,
  }

  project.packs = { ...project.packs, [duplicated.id]: duplicated }

  active.update((s) => ({ ...s, packId: duplicated.id, productId: duplicated.products[0]?.id }))
}

export function removePack(project: Project, pack: Pack) {
  const { [pack.id]: _, ...packs } = project.packs

  project.packs = packs

  active.update((s) => ({ ...s, packId: null }))
}

export function selectPack(pack: Pack) {
  const headers = fetchHeaders()

  if (!headers) {
    return
  }

  fetch('https://www.mixamo.com/api/v1/characters/update_primary', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      primary_character_id: pack.character.id,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      getActiveTab().then((tab) => {
        active.update((s) => ({ ...s, packId: pack.id }))

        if (tab.id) {
          chrome.tabs.reload(tab.id)
        }
      })
    })
}

export function switchCharacter(pack: Pack) {
  const character = get(selectedCharacter)

  if (character) {
    pack.character = character
  }

  return pack
}

export function addProduct(pack: Pack) {
  const product = get(selectedProduct)

  if (pack && product) {
    const p = {
      ...product,
      projectOverride: false,
      preferences: defaultPreferences(),
    }

    pack.products = [...pack.products, p]

    active.update((s) => ({ ...s, productId: p.id }))
  }

  return null
}

export function removeProduct(pack: Pack, productId: string) {
  if (pack) {
    pack.products = pack.products.filter((p) => p.id !== productId)

    active.update((s) => ({ ...s, productId: null }))
  }
}

export function setSearchQuery(tab: chrome.tabs.Tab, product: Product) {
  return new Promise<chrome.tabs.Tab>((resolve) => {
    const url = tab.url || ''
    const urlArr = url.split('?')
    const urlParams = qs.stringify({
      ...qs.parse(urlArr[1]),
      query: product.description,
    })
    const newUrl = `${urlArr[0]}?${urlParams}`

    if (tab.id) {
      chrome.tabs.update(tab.id, { url: newUrl }, () => {
        resolve(tab)
      })
    }
  })
}

export async function monitorDownload(uuid: string): Promise<string | undefined> {
  const headers = fetchHeaders()

  if (!headers) {
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  const monitorResult = await fetch(`https://www.mixamo.com/api/v1/characters/${uuid}/monitor`, {
    method: 'GET',
    headers,
  })

  const json = (await monitorResult.json()) as ExportProductResponse

  if (json.status === 'completed') {
    return json.job_result
  } else if (json.status === 'processing') {
    return monitorDownload(uuid)
  } else {
    // TODO handle other?
  }
}

export async function downloadPack(project: Project, pack: Pack) {
  const headers = fetchHeaders()

  if (!headers) {
    return
  }

  downloading.set({ total: pack.products.length, complete: 0, zip: 0 })

  const zip = new JSZip()

  for (let p of pack.products) {
    const preferences = p.projectOverride ? p.preferences : project.preferences

    const body: ExportProductRequest = {
      character_id: pack.character.id,
      product_name: p.name,
      preferences,
      gms_hash: [
        {
          ...p.details.gms_hash,
          params: p.details.gms_hash.params.map((param) => param[1]).join(','),
        },
      ],
      type: 'Motion',
    }

    const name = `${p.name}${preferences.format.includes('dae') ? '.dae' : '.fbx'}`

    const exportResult = await fetch('https://www.mixamo.com/api/v1/animations/export', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (exportResult.status === 202) {
      const json = (await exportResult.json()) as ExportProductResponse
      const downloadUrl = await monitorDownload(json.uuid)

      if (downloadUrl) {
        const downloadResult = await fetch(downloadUrl)

        if (downloadResult.status === 200) {
          const downloadBlob = await downloadResult.blob()
          zip.file(name, downloadBlob)
          downloading.update((s) => ({ ...s, complete: s.complete + 1 }))
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const packBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    downloading.update((s) => ({ ...s, zip: metadata.percent }))
  })

  saveAs(packBlob, pack.name)

  downloading.set({ total: 0, complete: 0, zip: 0 })
}
