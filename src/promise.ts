class Promise2 {
  state = "pending";
  STATE_FULFILLED = "fulfilled";
  STATE_REJECTED = "rejected";
  STATE_PENDING = "pending";
  handle: Array<Array<Function>>;

  constructor(fn: Function) {
    if (this.typeof(fn) !== "function") {
      throw new Error("构造参数必须是函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(result) {
    if (this.state !== this.STATE_PENDING) return
    this.changeState(this.STATE_FULFILLED);
    nextTick(() => {
      this.handle.forEach(item => {
        if (this.typeof(item[0]) === "function") {
          item[0] && item[0].call(undefined, result);
        }
      });
    });
  } 

  reject(reason) {
    if (this.state !== this.STATE_PENDING) return
    this.changeState(this.STATE_REJECTED);
    nextTick(() => {
      this.handle.forEach(item => {
        if (this.typeof(item[1]) === "function") {
          item[1].call(undefined, reason);
        }
      });
    });
  }

  private changeState(newState: string) {
    this.state = this.state === newState ? this.state : newState;
  }

  then(onFulfilled?: Function, onRejected?: Function) {
    this.handle = this.handle || [];
    this.handle.push([onFulfilled, onRejected]);
  }

  typeof(target: any) {
    return Object.prototype.toString
      .call(target)
      .match(/\[object (.+)\]/)[1]
      .toLowerCase();
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
