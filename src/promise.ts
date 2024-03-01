class Promise2 {
  state = 'pending'
  callbacks = []

  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('not a function')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }

  resolve(result) {
    setTimeout(() => {
      if (this.state !== 'pending') return
      this.callbacks.forEach(handle => {
        if (typeof handle[0] === 'function') {
          handle[0].call(undefined, result)
          this.state = 'fulfilled'
        }
      })
    }, 0)
  }

  reject(reason) {
    setTimeout(() => {
      if (this.state !== 'pending') return
      this.callbacks.forEach(handle => {
        if (typeof handle[1] === 'function') {
          handle[1].call(undefined, reason)
          this.state = 'rejected'
        }
      })
    }, 0)
  }

  then(succeed?, fail?) {
    const handle = []
    handle[0] = succeed
    handle[1] = fail
    this.callbacks.push(handle)
  }
}

export default Promise2
