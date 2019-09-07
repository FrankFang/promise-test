class Promsie2 {
  state = "pending";
  STATE_FULFILLED = "fulfilled";
  STATE_REJECTED = "rejected";
  STATE_PENDING = "pending";
  result: string;
  reason: string;
  handle: Array<Array<Function>>;

  constructor(fn: any) {
    if (this.typeof(fn) !== "function") {
      throw new Error("构造参数必须是函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(result) {
    if (this.state !== this.STATE_PENDING) return
    this.result = result;
    this.changeState(this.STATE_FULFILLED);
    setTimeout(() => {
      this.handle.forEach(item => {
        if (this.typeof(item[0]) === "function") {
          item[0] && item[0].call(undefined, result);
        }
      });
    }, 0);
  } 

  reject(reason) {
    if (this.state !== this.STATE_PENDING) return
    this.reason = reason;
    this.changeState(this.STATE_REJECTED);
    setTimeout(() => {
      this.handle.forEach(item => {
        if (this.typeof(item[1]) === "function") {
          item[1].call(undefined, reason);
        }
      });
    }, 0);
  }

  private changeState(newState: string) {
    this.state = this.state === newState ? this.state : newState;
  }

  then(onFulfilled?: any, onRejected?: any) {
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

export default Promsie2;
