type PromiseSucceedFn = null | ((result?: any) => void);
type PromiseFailFn = null | ((reason?: any) => void);
type PromiseState = "pending" | "fulfilled" | "rejected";
type PromiseHandler = [PromiseSucceedFn, PromiseFailFn];
type PromiseCallback = Array<PromiseHandler>;

const Util_isFunction = (value: any): boolean => {
  return typeof value === "function";
};

class Promise2 {
  state: PromiseState = "pending";
  callbacks: PromiseCallback = [];
  resolve(result: any) {
    if (this.isPromiseFulfilledOrRejected()) return;
    this.changeState("fulfilled");
    nextTick(() => {
      this.callbacks.forEach(handler => {
        const [succeed] = handler;
        // 不加 && succeed, typescript 会认为有可能为 null
        if (Util_isFunction(succeed) && succeed) {
          succeed.call(undefined, result);
        }
      });
    });
  }
  reject(reason) {
    if (this.isPromiseFulfilledOrRejected()) return;
    this.changeState("rejected");
    nextTick(() => {
      this.callbacks.forEach(handler => {
        const [, fail] = handler;
        // 不加 && fail, typescript 会认为有可能为 null
        if (Util_isFunction(fail) && fail) {
          fail.call(undefined, reason);
        }
      });
    });
  }
  constructor(fn) {
    if (!Util_isFunction(fn)) {
      throw new Error("Promise 必须接受一个函数作为参数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed?, fail?) {
    this.callbacks.push([succeed || null, fail || null]);
  }
  changeState(state: PromiseState) {
    if (this.isPromiseFulfilledOrRejected()) return;
    this.state = state;
  }
  isPromiseFulfilledOrRejected(): boolean {
    return this.state !== "pending";
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
