import { Message, MessageType, Product } from './types'

interface MutableXMLHttpRequest extends XMLHttpRequest {
  _url: string
  response: XMLHttpRequest['response']
  responseText: XMLHttpRequest['responseText']
}

export async function exportAllData() {
  const handle = await window.showSaveFilePicker({
    types: [
      {
        description: 'JSON Files',
        accept: { 'application/json': '.json' },
      },
    ],
  })
  const writer = await handle.createWritable()
  await writer.write(new Blob([JSON.stringify({})]))
  await writer.close()
}

export function dispatchMessageEvent(message: Message) {
  window.dispatchEvent(new CustomEvent<Message>('mbu_Message', { detail: message }))
}

;(function (open, send) {
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL) {
    const self = this as MutableXMLHttpRequest

    self._url = url.toString()

    if (self._url.includes('/api/v1/products/')) {
      this.onreadystatechange = function (e) {
        if (this.readyState === 4) {
          const payload = JSON.parse(this.responseText)

          dispatchMessageEvent({
            type: MessageType.ProductFetched,
            payload,
          })

          const win = window as any
          if (win.mbu_Product) {
            payload.details.gms_hash = win.mbu_Product.details.gms_hash
            win.mbu_Product = null
          }

          Object.defineProperty(self, 'response', { writable: true })
          Object.defineProperty(self, 'responseText', { writable: true })

          self.response = JSON.stringify(payload)
          self.responseText = JSON.stringify(payload)
        }
      }
    } else if (self._url.includes('/api/v1/products')) {
      this.onreadystatechange = function (e) {
        if (this.readyState === 4) {
          const payload = JSON.parse(this.responseText).results.map((p: any) => p.id)

          dispatchMessageEvent({
            type: MessageType.ProductsFetched,
            payload,
          })
        }
      }
    } else if (self._url.includes('/api/v1/characters/update_primary')) {
      this.onreadystatechange = function (e) {
        if (this.readyState === 4) {
          dispatchMessageEvent({
            type: MessageType.PrimaryUpdated,
            payload: JSON.parse(this.responseText),
          })
        }
      }
    }

    open.apply(this, [method, url, true])
  }

  XMLHttpRequest.prototype.send = function (data: XMLHttpRequestBodyInit) {
    const self = this as MutableXMLHttpRequest

    if (self._url.includes('/api/v1/animations/stream')) {
      dispatchMessageEvent({
        type: MessageType.StreamFetched,
        payload: JSON.parse(data.toString()),
      })
    }

    send.apply(this, [data])
  }
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send)
