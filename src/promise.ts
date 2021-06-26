type TState = "pending" | "fulfilled" | "rejected"

class Promise2 {
  state: TState = "pending";
  callbacks = [];
  /**
   * 
   */
  constructor(fn) {
    if(typeof fn !== "function") {
      throw new Error("new Promise 必须接收一个函数")
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  /**
   * 
   */
  resolveOrReject(state: TState, data: any, index: number) {
    if(this.state !== "pending") return
    this.state = state
    nextTick(() => {
      this.callbacks.map(hanld => {
        if(typeof hanld[index] === 'function') hanld[index].call(undefined, data)
      })
    })
  }
  /**
   * 
   */
  resolve(result) {
    this.resolveOrReject("fulfilled", result, 0)
  }
  /**
   * 
   */
  reject(err) {
    this.resolveOrReject("rejected", err, 1)
  }
  /**
   * 
   */
  then(success?, fail?) {
    let handle = []
    if(typeof success === "function") {
      handle[0] = success
    }
    if(typeof fail === "function") {
      handle[1] = fail
    }
    this.callbacks.push(handle)
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
