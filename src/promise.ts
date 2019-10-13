class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    if (this.state !== "pending") return
    this.state = "fulfilled"
    nextTick(() => {
      this.callList.forEach(handle => {
        if (typeof handle[0] === "function") {
          handle[0].call(undefined, result)
        }
      });
    }, 0)
  }
  reject(reason) {
    if (this.state !== "pending") return
    this.state = "rejected"
    nextTick(() => {
      this.callList.forEach(handle => {
        if (typeof handle[1] === "function") {
          handle[1].call(undefined, reason)
        }
      });
    }, 0)
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只接收函数")
    }
    this.state = "pending"
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(succeed?, fail?) {
    const handle = []
    handle[0] = onFulfilled
    handle[1] = onRejected
    this.callList.push(handle)
    return undefined
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
