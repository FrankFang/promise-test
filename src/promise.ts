export enum State {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected'
}

let nextTick

if (process !== undefined && typeof process.nextTick === 'function') {
  nextTick = (fn) => {
    process.nextTick(fn);
  }
} else if (typeof MutationObserver !== 'undefined') {
  let counter = 1
  nextTick = (fn) => {
    const observer = new MutationObserver(fn)
    const textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    })
    counter = counter + 1
    textNode.data = String(counter)
  }
}

class Promise {

  state = State.pending
  private value = undefined
  private reason = undefined
  private callbacks = []

  constructor (fn) {
    if (typeof fn !== 'function') {
      throw new Error(`Promise resolver ${fn} is not a function`)
    }

    fn(this.resolve.bind(this), this.reject.bind(this))
  }

  static resolve (value?) {
    return new Promise(resolve => {
      resolve(value)
    })
  }

  static reject (reason?) {
    return new Promise((_, reject) => {
      reject(reason)
    })
  }

  static deferred () {
    let defer = {}
    // @ts-ignore
    defer.promise = new Promise((resolve, reject) => {
      // @ts-ignore
      defer.resolve = resolve
      // @ts-ignore
      defer.reject = reject
    });
    return defer
  }

  private resolve (value?) {
    nextTick(() => {
      if (this.state !== State.pending) return
      this.state = State.fulfilled
      this.value = value
      this.callbacks.forEach(cb => {
        try {
          let res
          if (cb[0]){
            res = cb[0].call(undefined, value)
          } else {
            // 2.2.7.3  onFulfilled不是一个函数时 value要传给下一个then
            res = value
          }
          cb[2].resolveWith.call(cb[2], res)
        } catch (err) {
          cb[2].reject(err)
        }
      })
    })
  }

  private reject (reason?) {
    nextTick(() => {
      if (this.state !== State.pending) return
      this.state = State.rejected
      this.reason = reason
      this.callbacks.forEach(cb => {
        try {
          if (cb[1]) {
            const res = cb[1].call(undefined, reason)
            cb[2].resolveWith.call(cb[2], res)
          } else {
            cb[2].reject(reason)
          }
        } catch (err) {
          cb[2].reject(err)
        }
      })
    })
  }

  then (onFulfilled?, onRejected?) {
    const callback = []
    if (typeof onFulfilled === 'function') {
      if (this.state === State.fulfilled) {
        // 2.2.4 promise.then中嵌套promise.then，如果已经 fulfilled 就直接调用onFulfilled
        // 因为在当前tick中，嵌套的promise.then还未存放到callbacks里面
        process.nextTick(() => {
          onFulfilled.call(undefined, this.value)
        })
      } else {
        callback[0] = onFulfilled
      }
    }
    if (typeof onRejected === 'function') {
      if (this.state === State.rejected) {
        // 2.2.4 promise.then中嵌套promise.then，如果已经 rejected 就直接调用 onRejected
        // 因为在当前tick中，嵌套的promise.then还未存放到callbacks里面
        process.nextTick(() => {
          onRejected.call(undefined, this.reason)
        })
      } else {
        callback[1] = onRejected
      }
    }
    callback[2] = new Promise(() => {})
    this.callbacks.push(callback)
    return callback[2]
  }

  private resolveWithSelf () {
    this.reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }

  private resolveWithPromise (x) {
    x.then(
        value => {
          this.resolveWith(value)
        },
        reason => {
          this.reject(reason)
        }
    )
  }

  private resolveWithThenable (x) {
    let called = false
    let then
    try {
      then = x.then
    } catch (err) {
      this.reject(err)
    }
    if (typeof then === 'function') {
      try {
        then.call(
            x,
            y => {
              // 递归处理thenable，处理完了this.resolve才是出口
              if (called) return
              called = true
              this.resolveWith(y)
            },
            r => {
              if (called) return
              called = true
              this.reject(r)
            }
        )
      } catch (err) {
        if (called) return
        called = true
        this.reject(err)
      }
    } else {
      this.resolve(x)
    }
  }

  private resolveWith (x) {
    if (this === x) {
      this.resolveWithSelf()
    } else if (x instanceof Promise) {
      this.resolveWithPromise(x)
    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      this.resolveWithThenable(x)
    } else {
      this.resolve(x)
    }
  }
}

export default Promise
