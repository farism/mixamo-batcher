import App from './App.svelte'

// load GA
;(function () {
  const ga = document.createElement('script')
  ga.type = 'text/javascript'
  ga.async = true
  ga.src = 'https://ssl.google-analytics.com/ga.js'
  document.head.prepend(ga)
})()

let _gaq = (window as any)._gaq || []
_gaq.push(['_setAccount', 'UA-215294649-1'])
_gaq.push(['_trackPageview'])

const app = new App({
  target: document.getElementById('app'),
})

export default app
