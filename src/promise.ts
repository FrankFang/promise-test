 function isFunction(value: any) {
  return typeof value === "function";
}

export enum State {
  pending,
  fulfilled,
  rejected,
}
type onFulfilled = (data: unknown) => void;
type onRejected = (error: unknown) => void;
type handle = [onFulfilled | undefined, onRejected | undefined];
export class Promise2 {
  callBack: handle[] = [];
  state = State.pending;
  resolve(data: unknown) {
    if (this.state !== State.pending) {
      return;
    }
    this.state = State.fulfilled;
    setTimeout(() => {
      this.callBack.forEach((item) => {
        item[0]?.call(undefined, data);
      });
    });
  }
  reject(error: unknown) {
    if (this.state !== State.pending) {
      return;
    }
    this.state = State.rejected;
    setTimeout(() => {
      this.callBack.forEach((item) => {
        item[1]?.call(undefined, error);
      });
    });
  }
  constructor(fn: (res: unknown, rej: unknown) => void) {
    if (typeof fn !== "function") {
      throw new Error("fn 不是一个函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  then = (onFulfilled?: onFulfilled, onRejected?: onRejected) => {
    const handle: handle = [undefined, undefined];
    if (isFunction(onFulfilled)) {
      handle[0] = onFulfilled;
    }
    if (isFunction(onRejected)) {
      handle[1] = onRejected;
    }
    this.callBack.push(handle);
  };
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
