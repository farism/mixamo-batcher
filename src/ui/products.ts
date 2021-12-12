import qs from 'qs'
import { MessageType, Product, Stream } from '../types'
import { getActivePack, packs } from './packs'
import { createStore } from './store'
import { getActiveTab, sendMessageToActiveTab } from './tabs'

export const products = createStore<Product>('products')

export function viewProduct(product: Product) {
  return getActiveTab().then((tab) => {
    const url = tab.url || ''
    const urlArr = url.split('?')
    const urlParams = qs.stringify({
      ...qs.parse(urlArr[1]),
      query: product.description,
    })
    const newUrl = `${urlArr[0]}?${urlParams}`

    if (tab.id) {
      chrome.tabs.update(tab.id, { url: newUrl }, () => {
        sendMessageToActiveTab({
          type: MessageType.ViewProduct,
          payload: product,
        })
      })
    }
  })
}

export function syncStreamParamsToProduct(stream: Stream) {
  const pack = getActivePack()
  const gms = stream.gms_hash[0]

  if (pack && gms) {
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

      packs.set(pack)
    }
  }
}
