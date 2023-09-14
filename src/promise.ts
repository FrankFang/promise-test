class Promise2 {
  state = 'pending'
  callbacks = []

  resolve(result) {
    nextTick(() => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      for (let handle of this.callbacks) {
        if (typeof handle[0] === 'function') {
          let x
          try {
            x = handle[0].call(undefined, result)
          } catch (error) {
            return handle[2].reject(error)
          }
          handle[2].resolveWith(x)
        }
      }
    })
  }
  reject(reason) {
    nextTick(() => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      for (let handle of this.callbacks) {
        if (typeof handle[1] === 'function') {
          let x
          try {
            x = handle[1].call(undefined, reason)
          } catch (error) {
            return handle[2].resolveWith(x)
          }
          handle[2].resolveWith(x)
        }
      }
    })
  }
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise的参数需要是一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(succeed?, fail?) {
    let handle = []
    if (typeof succeed === 'function') {
      handle[0] = succeed
    }

    if (typeof fail === 'function') {
      handle[1] = fail
    }
    handle[2] = new Promise2(() => {})
    this.callbacks.push(handle)

    return handle[2]
  }
  resolveWithSelf() {
    this.reject(new TypeError('x should not be this'))
  }
  resolveWithPromise(x) {
    x.then(
      (result) => {
        this.resolve(result)
      },
      (reason) => {
        this.reject(reason)
      }
    )
  }
  getThen(x) {
    let then
    try {
      then = x.then
    } catch (error) {
      this.reject(error)
    }
    return then
  }
  resolveWithThenable(x) {
    try {
      x.then(
        (y) => {
          this.resolveWith(y)
        },
        (r) => {
          this.reject(r)
        }
      )
    } catch (error) {
      this.reject(error)
    }
  }
  resolveWithObject(x) {
    let then = this.getThen(x)
    if (then instanceof Function) {
      this.resolveWithThenable(x)
    } else {
      this.resolve(x)
    }
  }
  resolveWith(x) {
    if (this === x) {
      this.resolveWithSelf()
    } else if (x instanceof Promise2) {
      this.resolveWithPromise(x)
    } else if (x instanceof Object) {
      this.resolveWithObject(x)
    } else {
      this.resolve(x)
    }
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
