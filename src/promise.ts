class Promise2 {
  state = 'pending'
  callbacks = []
  resolve(result) {
    /* 完善 */
    setTimeout(() => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      for (const item of this.callbacks) {
        if (typeof item[0] === 'function') {
          item[0].call(undefined, result)
        }
      }
    })
  }
  reject(reason) {
    /* 完善 */
    setTimeout(() => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      for (const item of this.callbacks) {
        if (typeof item[1] === 'function') {
          item[1].call(undefined, reason)
        }
      }
    })
  }
  constructor(fn) {
    /* 完善 */
    if (typeof fn !== 'function') {
      throw new Error('fn 必须是一个函数')
    }
    fn(this.resolve, this.reject)
  }
  then(succeed?, fail?) {
    /* 完善 */
    this.callbacks.push([successFn, failFn])
  }
}

export default Promise2

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === 'function') {
    return process.nextTick(fn)
  } else {
    var counter = 1
    var observer = new MutationObserver(fn)
    var textNode = document.createTextNode(String(counter))

    observer.observe(textNode, {
      characterData: true,
    })

    counter = counter + 1
    textNode.data = String(counter)
  }
}
