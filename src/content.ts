import { Message, MessageType, Product } from './types'

let viewProduct: Product | null

/**
 * listen to events sent from extension
 */
chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === MessageType.Init) {
    chrome.runtime.sendMessage({
      type: MessageType.SetAccessToken,
      payload: localStorage.access_token,
    })
  } else if (message.type === MessageType.ViewProduct) {
    viewProduct = message.payload
    injectProductScript(viewProduct)
  }
})

/**
 * listen to custom events dispatched from xhr injection
 */
window.addEventListener('mbu_Message', function (e: CustomEvent<Message>) {
  chrome.runtime.sendMessage(e.detail)

  if (e.detail.type === MessageType.ProductsFetched && viewProduct) {
    const index = e.detail.payload.indexOf(viewProduct.id)

    if (index >= 0) {
      setTimeout(() => clickOnViewProduct(index), 500)
    } else {
      // TODO handle item not being on first page of page results
      // chrome.runtime.sendMessage({
      //   type: MessageType.FetchNextPage,
      //   payload: viewProduct.description,
      // })
    }
  }
} as EventListener)

/**
 * This is how we set the animation slider values when clicking an animation in a pack
 *
 * We inject the product into the window so the params can be used to override the params that
 * are returned with a product api response
 */
function injectProductScript(product: Product | null) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.text = `window.mbu_Product = ${JSON.stringify(product)}`
  document.body.appendChild(script)
  setTimeout(() => document.body.removeChild(script), 0)
}

/**
 * We store the page results and click on the tile which corresponds to the current `viewProduct`
 */
function clickOnViewProduct(index: number) {
  if (index >= 0) {
    const el = document.querySelectorAll('.product li')[index]
    el.dispatchEvent(new Event('click', { bubbles: true }))
  }
}

function createIframe() {
  const iframe = document.createElement('iframe')
  iframe.id = 'mixamo-batch'
  iframe.src = chrome.runtime.getURL('index.html')
  iframe.style.setProperty('border', '0')
  iframe.style.setProperty('bottom', '0')
  iframe.style.setProperty('position', 'absolute')
  iframe.style.setProperty('right', '0')
  iframe.style.setProperty('width', '16.666666%')
  iframe.style.setProperty('z-index', '1000')

  function setIframeHeight() {
    const node = document.querySelector('.sidebar-list > *')
    if (node) {
      const rect = node.getBoundingClientRect()

      iframe.style.setProperty('height', `calc(100% - ${rect.bottom + 10}px)`)
      iframe.style.setProperty('display', 'block')
    } else {
      iframe.style.setProperty('display', 'none')
    }
  }

  setInterval(setIframeHeight, 100)

  document.body.appendChild(iframe)
}

createIframe()
