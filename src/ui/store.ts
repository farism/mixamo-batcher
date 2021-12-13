import localforage from 'localforage'
import { get as storeGet, Writable, writable } from 'svelte/store'

function load<T extends { id: string }>(
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

  const loading = load<T>(persistent, store)

  function all() {
    return storeGet(store)
  }

  function get(id: string) {
    return storeGet(store)[id]
  }

  function set(item: T) {
    store.update((s) => {
      return { ...s, [item.id]: item }
    })

    persistent.setItem(item.id, item)
  }

  function remove(item: T) {
    store.update((s) => {
      const { [item.id]: _, ...next } = s

      return next
    })

    persistent.removeItem(item.id)
  }

  return {
    persistent,
    store,
    loading,
    all,
    get,
    set,
    remove,
  }
}
