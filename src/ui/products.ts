import { updateQueryParams } from '../common'
import { MessageType, Pack, Product, Project, Stream } from '../types'
import { projects } from './projects'
import { createStore } from './store'
import { sendMessageToActiveTab } from './tabs'

export const products = createStore<Product>('products')

export async function viewProduct(product: Product) {
  sendMessageToActiveTab({
    type: MessageType.ViewProduct,
    payload: product,
  })

  await updateQueryParams(product.description)
}

export function syncStreamParamsToProduct(project: Project, pack: Pack, stream: Stream) {
  const gms = stream.gms_hash[0]

  if (pack && gms) {
    pack.products = pack.products.map((p) => {
      if (p.details.gms_hash['model-id'] === gms['model-id']) {
        p.details.gms_hash['arm-space'] = gms['arm-space']
        p.details.gms_hash['inplace'] = gms['inplace']
        p.details.gms_hash['trim'] = gms['trim']

        gms.params
          .split(',')
          .map(parseFloat)
          .forEach((val, i) => {
            p.details.gms_hash.params[i][1] = val
          })
      }

      return p
    })
  }

  projects.store.update((s) => s)
}
