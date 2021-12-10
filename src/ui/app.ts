import { saveAs } from 'file-saver'
import qs from 'qs'
import JSZip from 'jszip'
import localforage from 'localforage'
import { nanoid } from 'nanoid'
import { get, Writable, writable } from 'svelte/store'
import {
  Active,
  Character,
  ExportResponse,
  Message,
  MessageType,
  Pack,
  Product,
  ProductSimple,
  Project,
  Stream,
} from '../types'
import { getActiveTab, sendMessageToActiveTab } from '../utils'

const jszip = new JSZip()

const urlCache: Record<string, any> = {}

const projectsPersistent = localforage.createInstance({ storeName: 'project' })

const packsPersisent = localforage.createInstance({ storeName: 'pack' })

const productsPersistent = localforage.createInstance({ storeName: 'product' })

const activePersistent = localforage.createInstance({ storeName: 'active' })

export const simpleProductStore = writable<Record<string, ProductSimple>>({})

export const projects = writable<Record<string, Project>>({})

export const packs = writable<Record<string, Pack>>({})

export const products = writable<Record<string, Product>>({})

export const selectedCharacter = writable<Character | null>(null)

export const selectedProduct = writable<Product | null>(null)

export const selectedStream = writable<Stream | null>(null)

export const active = writable<Active | null>({})

export const accessToken = writable<string | null>(null)

function isMixamoOrigin(
  details: chrome.webRequest.WebRequestBodyDetails | chrome.webRequest.WebResponseCacheDetails,
) {
  return details.initiator === 'https://www.mixamo.com'
}

export function initializeMessageListener() {
  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.type === MessageType.OnCompleteUpdatePrimary) {
      setTimeout(() => fetchPrimary(), 500)
    } else if (message.type === MessageType.OnBeforeRequestProducts) {
      if (isMixamoOrigin(message.payload)) {
        // TODO investigate why our mirrored products request coming too soon after the
        // original request will get a different set of data
        setTimeout(() => fetchProducts(message.payload.url), 500)
      }
    } else if (message.type === MessageType.OnCompleteRequestProducts) {
    } else if (message.type === MessageType.OnBeforeRequestProduct) {
      if (isMixamoOrigin(message.payload)) {
        fetchProduct(message.payload.url)
      }
    } else if (message.type === MessageType.OnCompleteRequestProduct) {
    } else if (message.type === MessageType.OnBeforeRequestStream) {
      // syncStreamParamsToProduct(message.payload)
    }
  })
}

function initializeStore<T extends { id: string }>(
  localStore: LocalForage,
  store: Writable<Record<string, T>>,
) {
  return localStore
    .keys()
    .then((keys) => keys.map((key) => localStore.getItem<T>(key)))
    .then((gets) => Promise.all(gets))
    .then((items) => {
      store.update((store) => {
        items.forEach((item) => {
          store[item.id] = item
        })

        return store
      })
    })
}

export function initializeStores() {
  Promise.all([
    initializeStore(projectsPersistent, projects),
    initializeStore(packsPersisent, packs),
    initializeStore(productsPersistent, products),
  ]).then(() => {
    const p = get(packs)
    active.set({ pack: p[Object.keys(p)[0]] })

    // we need to initialize all the stores before setting any active stuff
    activePersistent.getItem<Active>('active').then((ap) => {
      if (ap) {
        active.set(ap)
        activePersistent.setItem('active', null)
      }
    })
  })
}

export function initialize() {
  initializeMessageListener()
  initializeStores()

  // console.log('MBU requesting access token')

  sendMessageToActiveTab({ type: MessageType.Init }, (response) => {
    // console.log('MBU received access token: ', response)

    accessToken.set(response)
  })
}

function fetchHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Api-Key': 'mixamo2',
    Authorization: `Bearer ${get(accessToken)}`,
  }
}

function fetchPrimary() {
  fetch('https://www.mixamo.com/api/v1/characters/primary', { headers: fetchHeaders() })
    .then((response) => response.json())
    .then((json: { primary_character_id: string; primary_character_name: string }) => {
      selectedCharacter.set({
        id: json.primary_character_id,
        name: json.primary_character_name,
      })
    })
}

function fetchProducts(url: string) {
  ;(urlCache[url]
    ? Promise.resolve(urlCache[url])
    : fetch(url, { headers: fetchHeaders() }).then((response) => response.json())
  ).then((json: { results: ProductSimple[] }) => {
    urlCache[url] = json

    simpleProductStore.update((store) => {
      json.results.forEach((product) => {
        store[product.id] = product
      })

      return store
    })
  })
}

function fetchProduct(url: string) {
  ;(urlCache[url]
    ? Promise.resolve(urlCache[url])
    : fetch(url, { headers: fetchHeaders() }).then((response) => response.json())
  ).then((json: Product) => {
    urlCache[url] = json

    products.update((store) => {
      store[json.id] = json

      productsPersistent.setItem(json.id, json)

      selectedProduct.set(json)

      return store
    })
  })
}

export function selectPack(pack: Pack) {
  fetch('https://www.mixamo.com/api/v1/characters/update_primary', {
    method: 'POST',
    headers: fetchHeaders(),
    body: JSON.stringify({
      primary_character_id: pack.character.id,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      chrome.tabs.query({ active: true }, (tabs) => {
        active.update((store) => ({ ...store, pack }))

        activePersistent.setItem('active', get(active))

        chrome.tabs.reload(tabs[0]?.id)
      })
    })
}

export function saveProject(project: Project) {
  projectsPersistent.setItem(project.id, project)

  projects.update((store) => {
    store[project.id] = project

    return store
  })
}

export function createProject(name: string) {
  const project: Project = {
    id: nanoid(),
    name,
  }

  saveProject(project)

  active.update((store) => ({ ...store, project }))

  return project
}

export function removeProject(project: Project) {
  projectsPersistent.removeItem(project.id)

  projects.update((store) => {
    delete store[project.id]

    return store
  })
}

export function savePack(pack: Pack) {
  packsPersisent.setItem(pack.id, pack)

  packs.update((store) => {
    store[pack.id] = pack

    return store
  })
}

export function createPack(name: string) {
  const character = get(selectedCharacter)
  const product = get(selectedProduct)
  const project = get(active).project
  const pack: Pack = {
    id: nanoid(),
    projectId: project.id,
    name,
    character,
    products: product ? [product] : [],
  }

  savePack(pack)

  active.update((store) => ({ ...store, pack }))

  return pack
}

export function switchPackCharacter(pack: Pack) {
  pack.character = get(selectedCharacter)

  savePack(pack)

  active.update((store) => ({ ...store, pack }))

  return pack
}

export function deletePack(pack: Pack) {
  packsPersisent.removeItem(pack.id)

  packs.update((store) => {
    delete store[pack.id]

    return store
  })
}

export function addProductToPack() {
  const pack = get(packs)[get(active).pack.id]

  if (pack) {
    pack.products.push(get(selectedProduct))

    savePack(pack)
  }
}

export function removeProductFromPack(productId: string) {
  const pack = get(packs)[get(active).pack.id]

  if (pack) {
    pack.products = pack.products.filter((p) => p.id !== productId)

    savePack(pack)
  }
}

function setSearchQuery(tab: chrome.tabs.Tab, product: Product) {
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

function setViewedProduct(tab: chrome.tabs.Tab, product: Product) {
  return new Promise<chrome.tabs.Tab>((resolve) => {
    sendMessageToActiveTab({
      type: MessageType.ViewProduct,
      payload: product,
    })

    resolve(tab)
  })
}

export function viewProduct(product: Product) {
  getActiveTab()
    .then((tab) => setViewedProduct(tab, product))
    .then((tab) => setSearchQuery(tab, product))
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

export async function monitorProductDownload(uuid: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return fetch(`https://www.mixamo.com/api/v1/characters/${uuid}/monitor`, {
    method: 'GET',
    headers: fetchHeaders(),
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
  fetch('https://www.mixamo.com/api/v1/animations/export', {
    method: 'POST',
    headers: fetchHeaders(),
    body: JSON.stringify(exportRequestData),
  })
    .then((response) => response.json())
    .then((json: ExportResponse) => monitorProductDownload(json.uuid))
    .then((file) => fetch(file))
    .then((response) => response.blob())
    .then((blob) => {
      jszip.file('first.fbx', blob)
      jszip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, 'files.zip')
      })
    })
}

function syncStreamParamsToProduct(stream: Stream) {
  const gms = stream.gms_hash[0]
  const pack = get(active).pack

  if (gms && pack) {
    const product = pack.products.find((p) => p.details.gms_hash['model-id'] === gms['model-id'])

    if (product) {
      product.details.gms_hash['arm-space'] = gms['arm-space']
      product.details.gms_hash['inplace'] = gms['inplace']
      product.details.gms_hash['trim'] = gms['trim']

      gms.params
        .split(',')
        .map(parseFloat)
        .forEach((val, i) => {
          product.details.gms_hash.params[i][1] = val
        })

      savePack(pack)
    }
  }
}
