interface MutableXMLHttpRequest extends XMLHttpRequest {
  response: XMLHttpRequest['response']
  responseText: XMLHttpRequest['responseText']
}

;(function (open) {
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL) {
    const self: MutableXMLHttpRequest = this

    if (url.toString().indexOf('/products/') >= 0) {
      self.onreadystatechange = function () {
        if (self.readyState === 4) {
          Object.defineProperty(this, 'response', { writable: true })
          Object.defineProperty(this, 'responseText', { writable: true })
          const response = JSON.stringify({})
          self.response = response
          self.responseText = response
        }
      }
    }

    open.apply(self, [method, url, true])
  }
})(XMLHttpRequest.prototype.open)
