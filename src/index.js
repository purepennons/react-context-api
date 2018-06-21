export function getVariablesArray(str) {
  if (!_.isString(str)) return false
  return str.match(/\{[A-Za-z_][A-Za-z0-9_]*\}/gm)
}

export function isValidParanthesesPairs(str) {
  if (!_.isString(str)) return false
  const result = str.match(/\{|\}/gm).reduce(
    (acc, v, idx, arr) => {
      if (acc.done) return acc

      switch (v) {
        case '{':
          if (acc.prev !== '' || idx === arr.length - 1) {
            acc.result = false
            acc.done = true
          }
          acc.prev = '{'
          break
        case '}':
          if (acc.prev !== '{') {
            acc.result = false
            acc.done = true
          }
          acc.prev = ''
          break
        default:
          acc.result = false
          acc.done = true
      }

      return acc
    },
    { prev: '', result: true, done: false },
  )

  return result.result
}
