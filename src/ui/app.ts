import { saveAs } from 'file-saver'
import localforage from 'localforage'
import { get, writable } from 'svelte/store'
import { Active, Character, Message, MessageType, Product } from '../types'
import { products, syncStreamParamsToProduct } from './products'
import { projects } from './projects'
import { sendMessageToActiveTab } from './tabs'

export const accessToken = writable<string | null>(null)

export const selectedCharacter = writable<Character | null>(null)

export const selectedProduct = writable<Product | null>(null)

export const active = writable<Active>({})

export const activePersistent = localforage.createInstance({ storeName: 'active' })

export function suffix(val: Array<any> | object | number) {
  return (Array.isArray(val)
    ? val.length
    : typeof val === 'object'
    ? Object.keys(val).length
    : val) === 1
    ? ''
    : 's'
}

export function fetchHeaders() {
  const token = get(accessToken)

  if (!token) {
    return null
  }

  return {
    'Content-Type': 'application/json',
    'X-Api-Key': 'mixamo2',
    Authorization: `Bearer ${token}`,
  }
}

Promise.all([projects.loading, products.loading]).then(() => {
  activePersistent.getItem<Active>('active').then((ap) => {
    if (ap) {
      active.set(ap)
    }

    active.subscribe((val) => {
      activePersistent.setItem('active', val)
    })
  })
})

export function initialize() {
  chrome.runtime.onMessage.addListener((message: Message) => {
    // console.log({ ...message, type: MessageType[message.type].toString() })
    if (message.type === MessageType.SetAccessToken) {
      accessToken.set(message.payload)
    } else if (message.type === MessageType.ProductFetched) {
      selectedProduct.set(message.payload)
      products.set(message.payload)
    } else if (message.type === MessageType.StreamFetched) {
      // syncStreamParamsToProduct(message.payload)
    } else if (message.type === MessageType.PrimaryUpdated) {
      fetchPrimary()
    }
  })

  sendMessageToActiveTab({ type: MessageType.Init })
}

export async function exportAllData() {
  sendMessageToActiveTab({
    type: MessageType.Export,
    payload: projects.all(),
  })
}

export function exportData() {}

export function importProjects() {}

function fetchPrimary() {
  const headers = fetchHeaders()

  if (!headers) {
    return
  }

  fetch('https://www.mixamo.com/api/v1/characters/primary', {
    headers,
  })
    .then((response) => response.json())
    .then((json: { primary_character_id: string; primary_character_name: string }) => {
      selectedCharacter.set({
        id: json.primary_character_id,
        name: json.primary_character_name,
      })
    })
}
