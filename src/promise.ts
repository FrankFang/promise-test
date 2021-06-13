class Promise2 {
  private state: String = 'pending'
  private callbackList: Function[][] = []

  constructor(fn:Function) {
    try {
      fn((...params)=>{ setTimeout(()=>{this.resolve(...params)}) }, this.reject.bind(this))
    } catch (error) {
      this.reject.bind(this, error)
    }

  }

  then(onFulfilled:Function, onRejected: Function){
    if(this.state === 'pending') {
      this.callbackList.push([onFulfilled, onRejected ])
    }

    return this
  }

  resolve(...args) {
    if(this.state === 'pending') {
      this.state = 'fulfilled'
      this.callbackList.forEach(e => {
        e[0](...args)
      })
      this.callbackList = []
    }
  }

  reject(args) {
    if(this.state === 'pending') {
      this.state = 'fulfilled'
      this.callbackList.forEach(e => {
        e[1](...args)
      })
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
