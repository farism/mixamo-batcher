import { Message, MessageType, Product } from './types'

let viewProduct: Product | null

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  if (message.type === MessageType.Init) {
    sendResponse(localStorage.access_token)

    return true
  } else if (message.type === MessageType.ViewProduct) {
    viewProduct = message.payload
  } else if (message.type === MessageType.OnCompleteRequestProducts) {
    if (viewProduct) {
      setTimeout(clickOnViewProduct, 250)
    }
  }
})

function clickOnViewProduct() {
  if (!viewProduct) {
    return
  }
  0

  const query = document.querySelectorAll('.product li')

  const product = Array.from(query).find((el) => {
    if (el.textContent) {
      return el.textContent.indexOf(viewProduct?.description || '') >= 0
    }
  })

  if (product) {
    product.dispatchEvent(new Event('click', { bubbles: true }))
  }

  viewProduct = null
}

// Create the iframe which will hold the UI
const iframe = document.createElement('iframe')
iframe.id = 'mixamo-batch'
iframe.src = chrome.runtime.getURL('dist/ui/index.html')
iframe.style.setProperty('border', '0')
iframe.style.setProperty('bottom', '0')
iframe.style.setProperty('position', 'absolute')
iframe.style.setProperty('right', '0')
iframe.style.setProperty('width', '16.666666%')
iframe.style.setProperty('z-index', '1000')

document.body.appendChild(iframe)

function setIframeHeight() {
  const node = document.querySelector('.sidebar-list > *')

  if (node) {
    const rect = node.getBoundingClientRect()

    iframe.style.setProperty('height', `calc(100% - ${rect.bottom + 10}px)`)
  }
}

setInterval(setIframeHeight, 100)
