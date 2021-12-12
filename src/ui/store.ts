import localforage from 'localforage'
import { get, Writable, writable } from 'svelte/store'

function syncFromPersistent<T extends { id: string }>(
  persistent: LocalForage,
  store: Writable<Record<string, T>>,
) {
  return persistent
    .keys()
    .then((keys) => keys.map((key) => persistent.getItem<T>(key)))
    .then((gets) => Promise.all(gets))
    .then((items) => {
      store.update((store) => {
        items.forEach((item) => {
          if (item) {
            store[item.id] = item
          }
        })

        return store
      })
    })
}

export function createStore<T extends { id: string }>(name: string) {
  const persistent = localforage.createInstance({ name })

  const store = writable<Record<string, T>>({})

  const loading = syncFromPersistent<T>(persistent, store)

  function set(item: T) {
    store.update((s) => {
      s[item.id] = item

      return s
    })

    persistent.setItem(item.id, item)
  }

  function clear(item: T) {
    store.update((s) => {
      delete s[item.id]

      return s
    })

    persistent.removeItem(item.id)
  }

  function data() {
    return get(store)
  }

  return {
    persistent,
    store,
    set,
    clear,
    data,
    loading,
  }
}
