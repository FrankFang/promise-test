class Promise2 {
  state = "pending";
  callbacks = [];
  resolve = (result) => {
    /* 完善 */
    if(this.state !== 'pending') return
    this.state = 'fulfilled'
    setTimeout(() => {
      this.callbacks.forEach(handle => {
        if(typeof handle[0] === 'function') {
          let x
          try {
            x = handle[0].call(undefined, result)
          } catch (error) {
            return handle[2].reject(error)
          }
          handle[2].resolveWith(x)
        }
      })
    }, 0)
  }
  reject = (reason) => {
    /* 完善 */
    if(this.state !== 'pending') return
    this.state = 'rejected'
    setTimeout(() => {
      this.callbacks.forEach(handle => {
        if(typeof handle[1] === 'function') {
          let x
          try {
            x = handle[1].call(undefined, reason)
          } catch (error) {
            return handle[2].reject(error)
          }
          handle[2].resolveWith(x)
        }
      })
    }, 0)
  }
  constructor(fn) {
    if(fn instanceof Function) {
      fn(this.resolve, this.reject)
    } else {
      throw new Error('只接受函数')
    }
  }
  then = (succeed?, fail?) => {
    /* 完善 */
    const handle = []
    if(succeed instanceof Function) {
      handle[0] = succeed
    }
    if(fail instanceof Function) {
      handle[1] = fail
    }
    handle[2] = new Promise2(() => {})
    this.callbacks.push(handle)
    return handle[2]
  }

  resolveWith = (x) => {
    if(this === x) {
      this.reject(new TypeError())
    } else if(x instanceof Promise2) {
      x.then(res => this.resolve(res), err => this.reject(err))
    } else if(x instanceof Object) {
      let then
      try {
        then = x.then
      } catch (error) {
        this.reject(error)
      }
      if(then instanceof Function) {
        try {
          x.then(res => this.resolveWith(res), err => this.reject(err))
        } catch (error) {
          this.reject(error)
        }
      } else {
        this.resolve(x)
      }
    } else {
      this.resolve(x)
    }
  }
}

export default Promise2;

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}
