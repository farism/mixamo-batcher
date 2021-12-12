import { Message } from '../types'

export function getActiveTab() {
  return new Promise<chrome.tabs.Tab>((resolve, reject) => {
    chrome.tabs.query({ active: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        resolve(tabs[0])
      } else {
        reject()
      }
    })
  })
}

export function sendMessageToActiveTab(message: Message, callback?: (response: any) => void) {
  getActiveTab().then((tab) => {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message, callback)
    }
  })
}
