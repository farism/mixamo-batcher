const script = document.createElement('script')
script.src = chrome.runtime.getURL('dist/custom-xhr.js')
;(document.head || document.documentElement).prepend(script)
