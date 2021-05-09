class Promise2 {

  // 实例的属性， static 开头的是类的属性
  state = 'pending' // fulfilled | rejected
  callbacks = []


  // 执行 resolve 的时候 执行传给 then 方法的函数
  resolve(result) {

    setTimeout(() => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'

      this.callbacks.forEach(handler => {
        if (typeof handler[0] === 'function') {
          handler[0].call(undefined, result)
        }
      })

    })
  }
  reject(reson) {

    setTimeout(() => {
      if (this.state !== 'pending') return
      this.state = 'rejected'

      this.callbacks.forEach(handler => {
        if (typeof handler[1] === 'function') {
          handler[1].call(undefined, reson)
        }
      })

    })
  }

  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('接受的必须是函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }

  // then 做的就是把函数放进 handler 中
  then(sucessedFn?, failedFn?) {
    const handler = []
    if (typeof sucessedFn === 'function') {
      handler[0] = sucessedFn
    }
    if (typeof failedFn === 'function') {
      handler[1] = failedFn
    }
    this.callbacks.push(handler)
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
