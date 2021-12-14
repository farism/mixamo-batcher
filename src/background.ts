import { updateQueryParams } from './common'
import { Message, MessageType } from './types'

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === MessageType.FetchNextPage) {
    updateQueryParams(message.payload, true)
  }
})
