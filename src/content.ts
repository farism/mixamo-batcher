import { Message, MessageType, Product } from './types'

let currentProductIds: string[] = []

// listen to custom events dispatched from custom xhr injection
window.addEventListener('mbu_Message', function (e: CustomEvent<Message>) {
  chrome.runtime.sendMessage(e.detail)

  if (e.detail.type === MessageType.ProductsFetched) {
    currentProductIds = e.detail.payload
  }
} as EventListener)

// listen to events dispatched from background/iframe
chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === MessageType.Init) {
    chrome.runtime.sendMessage({
      type: MessageType.SetAccessToken,
      payload: localStorage.access_token,
    })
  } else if (message.type === MessageType.ViewProduct) {
    injectProductScript(message.payload)
  } else if (message.type === MessageType.Export) {
    injectExportScript(message.payload)
  }
})

function injectProductScript(product: Product) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.text = `window.mbu_Product = ${JSON.stringify(product)}`

  document.body.appendChild(script)

  setTimeout(() => document.body.removeChild(script), 0)

  setTimeout(() => clickOnViewProduct(product), 500)
}
function injectExportScript(data: object) {
  const blob = JSON.stringify(data)
  console.log({ data, blob })
  const script = document.createElement('script')
  script.type = 'module'
  script.text = `
    const handle = await window.showSaveFilePicker({
      types: [
        {
          description: 'JSON Files',
          accept: { 'application/json': '.json' },
        },
      ],
    })
    const writer = await handle.createWritable()
    await writer.write(new Blob(['${blob}']))
    await writer.close()
  `

  console.log({ script })

  document.body.appendChild(script)

  // setTimeout(() => document.body.removeChild(script), 0)
}

function clickOnViewProduct(product: Product) {
  const index = currentProductIds.indexOf(product.id)

  if (index >= 0) {
    const el = document.querySelectorAll('.product li')[index]
    el.dispatchEvent(new Event('click', { bubbles: true }))
  }
}

function createIframe() {
  const iframe = document.createElement('iframe')
  iframe.id = 'mixamo-batch'
  iframe.src = chrome.runtime.getURL('dist/ui/index.html')
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
    }
  }

  setInterval(setIframeHeight, 100)

  document.body.appendChild(iframe)
}

createIframe()
