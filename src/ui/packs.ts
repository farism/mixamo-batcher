import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { nanoid } from 'nanoid'
import qs from 'qs'
import { get } from 'svelte/store'
import { ExportResponse, Pack, Product } from '../types'
import { active, fetchHeaders, selectedCharacter, selectedProduct } from './app'
import { defaultDownload, defaultPackProduct } from './constants'
import { createStore } from './store'
import { getActiveTab } from './tabs'

export const packs = createStore<Pack>('packs')

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
        active.update((store) => ({ ...store, packId: pack.id }))

        if (tab.id) {
          chrome.tabs.reload(tab.id)
        }
      })
    })
}

export function getActivePack() {
  const id = get(active).packId

  if (id) {
    return get(packs.store)[id]
  }
}

export function createPack(name: string) {
  const projectId = get(active).projectId
  const character = get(selectedCharacter)

  if (projectId && character) {
    const pack: Pack = {
      id: nanoid(),
      projectId,
      name,
      character,
      products: [defaultPackProduct()],
    }

    packs.set(pack)

    active.update((store) => ({ ...store, packId: pack.id }))

    return pack
  }
}

export function removePack(pack: Pack) {
  packs.clear(pack)
}

export function switchCharacter(pack: Pack) {
  const character = get(selectedCharacter)

  if (character) {
    pack.character = character

    packs.set(pack)

    active.update((store) => ({ ...store, packId: pack.id }))
  }

  return pack
}

export function addProduct() {
  const pack = getActivePack()
  const product = get(selectedProduct)

  if (pack && product) {
    pack.products.push({
      ...product,
      download: defaultDownload(),
    })

    packs.set(pack)

    return product.id
  }

  return null
}

export function removeProduct(productId: string) {
  const pack = getActivePack()

  if (pack) {
    pack.products = pack.products.filter((p) => p.id !== productId)
    packs.set(pack)
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

const exportRequestData = {
  gms_hash: [
    {
      'model-id': 102450901,
      mirror: false,
      trim: [0, 100],
      overdrive: 0,
      params: '0,0',
      'arm-space': 0,
      inplace: false,
    },
  ],
  preferences: {
    format: 'fbx7_2019',
    skin: 'true',
    fps: '30',
    reducekf: '0',
  },
  character_id: 'efb06b46-a470-49b2-b7da-a06755d4dba7',
  type: 'Motion',
  product_name: 'Shoved Reaction With Spin',
}

export async function monitorProductDownload(uuid: string): Promise<any> {
  const headers = fetchHeaders()

  if (!headers) {
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  return fetch(`https://www.mixamo.com/api/v1/characters/${uuid}/monitor`, {
    method: 'GET',
    headers,
  })
    .then((response) => response.json())
    .then((json: ExportResponse) => {
      if (json.status === 'completed') {
        return json.job_result
      } else if (json.status === 'processing') {
        return monitorProductDownload(uuid)
      } else {
      }
    })
}

export function downloadPack() {
  const headers = fetchHeaders()

  if (!headers) {
    return
  }

  fetch('https://www.mixamo.com/api/v1/animations/export', {
    method: 'POST',
    headers,
    body: JSON.stringify(exportRequestData),
  })
    .then((response) => response.json())
    .then((json: ExportResponse) => monitorProductDownload(json.uuid))
    .then((file) => fetch(file))
    .then((response) => response.blob())
    .then((blob) => {
      const jszip = new JSZip()
      jszip.file('first.fbx', blob)
      jszip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, 'files.zip')
      })
    })
}
