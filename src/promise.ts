class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    setTimeout(() => {
      if(this.state === 'pending') return
      this.state = 'fulfilled'
      this.callbacks.forEach((handle) => {
          if(typeof handle[0] === 'function') {
              handle[0].call(undefined, result)
          }
      })
    })
  }
  reject(reason) {
    setTimeout(() => {
        if(this.state === 'pending') return
        this.state = 'rejected'
        this.callbacks.forEach((handle) => {
            if(typeof handle[1] === 'function') {
              handle[1].call(undefined, reason)
            }
        })
    })
  }
  constructor(fn) {
    if(typeof fn !== 'function') {
      throw new Error('只接收函数！')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(succeed?, fail?) {
    let handle = []
    if(typeof succeed === 'function') {
        handle[0] = succeed
    }
    if(typeof fail === 'function') {
        handle[1] = fail
    }
    this.callbacks.push(handle)
    return this
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
