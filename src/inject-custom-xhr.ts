const script = document.createElement('script')
script.src = chrome.runtime.getURL('dist/custom-xhr.js')

// we run at document_start and prepend to head so that we run before newrelic xhr hook
;(document.head || document.documentElement).prepend(script)
