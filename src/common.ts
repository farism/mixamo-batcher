import qs from 'qs'
import { getActiveTab } from './ui/tabs'

export function updateQueryParams(query: string, nextPage: boolean = false) {
  return new Promise((resolve) => {
    getActiveTab().then((tab) => {
      if (tab.id && tab.url) {
        const arr = tab.url.split('?')
        const params = qs.parse(arr[1])
        const page = (params.page ?? '1') as string
        const newParams = qs.stringify({
          ...params,
          query,
          page: nextPage ? parseInt(page, 10) + 1 : 1,
        })
        const url = `${arr[0]}?${newParams}`

        chrome.tabs.update(tab.id, { url }, resolve)
      }
    })
  })
}
