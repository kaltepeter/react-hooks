import * as React from 'react'

export const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
        window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.content = key;

    if (state && state.length > 0) {
      window.localStorage.setItem(key, serialize(state))
    } else {
      window.localStorage.removeItem(key)
    }
  }, [key, serialize, state])

  return [state, setState]
}

export default useLocalStorageState
