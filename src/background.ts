import { Message, MessageType, Stream } from './types'
import { sendMessageToActiveTab } from './utils'

function sendMessage(message: Message) {
  chrome.runtime.sendMessage(message)

  sendMessageToActiveTab(message)
}

chrome.webRequest.onCompleted.addListener(
  (details) => {
    sendMessage({
      type: MessageType.OnCompleteUpdatePrimary,
      payload: details,
    })
  },
  {
    urls: ['https://www.mixamo.com/api/v1/characters/update_primary'],
  },
)

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    sendMessage({
      type: MessageType.OnBeforeRequestProducts,
      payload: details,
    })
  },
  {
    urls: ['https://www.mixamo.com/api/v1/products?page*'],
  },
  ['requestBody'],
)

chrome.webRequest.onCompleted.addListener(
  (details) => {
    sendMessage({
      type: MessageType.OnCompleteRequestProducts,
    })
  },
  {
    urls: ['https://www.mixamo.com/api/v1/products?page*'],
  },
)

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    sendMessage({
      type: MessageType.OnBeforeRequestProduct,
      payload: details,
    })
  },
  {
    urls: ['https://www.mixamo.com/api/v1/products/*'],
  },
  ['requestBody'],
)

chrome.webRequest.onCompleted.addListener(
  (details) => {
    sendMessage({
      type: MessageType.OnCompleteRequestProduct,
      payload: details,
    })
  },
  {
    urls: ['https://www.mixamo.com/api/v1/products/*'],
  },
)

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const bytes = details.requestBody?.raw?.[0]?.bytes

    if (bytes) {
      const arr = new Uint8Array(bytes)
      const string = new TextDecoder().decode(arr)
      const payload = JSON.parse(string) as Stream

      sendMessage({
        type: MessageType.OnBeforeRequestStream,
        payload,
      })
    }
  },
  {
    urls: ['https://www.mixamo.com/api/v1/animations/stream'],
  },
  ['requestBody'],
)
