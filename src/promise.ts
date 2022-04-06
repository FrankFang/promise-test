class Promise2 {
  state = "pending";
  callbacks = [];

  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error("必须是一个函数")
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }

  private resolveOrReject(state, data, i) {
    if (this.state !== "pending") {
      return
    }
    this.state = state
    nextTick(() => {
      this.callbacks.forEach(handle => {
        let x
        if (typeof handle[i] === 'function') {
          try {
            x = handle[i].call(undefined, data)
          } catch (error) {
            return handle[2].reject(error)
          }
        }
        handle[2].resolveWith(x)
      })
    })
  }

  resolve(result) {
    this.resolveOrReject("fulfilled", result, 0)
  }

  reject(reason) {
    this.resolveOrReject("rejected", reason, 1)
  }

  then(succeed?, fail?) {
    /* 完善 */
    const tempArr = []
    if (typeof succeed === 'function') {
      tempArr[0] = succeed
    }
    if (typeof fail === 'function') {
      tempArr[1] = fail
    }
    tempArr[2] = new Promise2(() => { })
    this.callbacks.push(tempArr)
    return tempArr[2]
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

  resolveWithSelf() {
    throw new Error()
  }
  resolveWithPromise(x) {
    x.then(result => {
      this.resolve(result)
    }, reason => {
      this.reject(reason)
    })
  }
  resolveGetThen(x) {
    let then
    try {
      then = x.then
      return then
    } catch (error) {
      this.reject(error)
    }
  }
  resolveThenable(then) {
    try {
      then(result => {
        this.resolveWith(result)
      }, reason => {
        this.reject(reason)
      })
    } catch (error) {
      this.reject(error)
    }
  }
  resolveWithObject(x) {
    let then = this.resolveGetThen(x)
    if (then instanceof Function) {
      this.resolveThenable(then)
    } else {
      this.resolve(x)
    }
  }
}

export default Promise2;

// process.nextTick 仅适用在node环境，不适用在浏览器环境中
// 在node中setImmediate和setTimeout的执行顺序是不能确定的
// 在浏览器中可以借用MutationObserver，MutationObserver(fn)中的fn优先级一定比setTimeout高，会在setTimeout之前执行
function nextTick(fn) {
  if (typeof window === 'undefined' && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    // 结点改变引起 observer中的fn执行
    counter = counter + 1;
    textNode.data = String(counter);
  }
}