class Promise2 {
  PENDING = 'pending';
  FULFILLED = 'fulfilled';
  REJECTED = 'rejected';
  state = this.PENDING;
  fulfilledCallbacks = [];
  rejectedCallbacks = [];

  resolve(result) {
    if (this.state !== this.PENDING) return;
    this.state = this.FULFILLED;
    setTimeout(() => {
      this.fulfilledCallbacks.map(
        cb => typeof cb === 'function' && cb.call(undefined, result)
      );
    }, 0);
  }
  reject(reason) {
    if (this.state !== this.PENDING) return;
    this.state = this.REJECTED;
    setTimeout(() => {
      this.rejectedCallbacks.map(
        cb => typeof cb === 'function' && cb.call(undefined, reason)
      );
    }, 0);
  }

  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('new Promise2() 的参数只能是函数');
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  then(onFulfilled?, onRejected?) {
    typeof onFulfilled === 'function' &&
      this.fulfilledCallbacks.push(onFulfilled);
    typeof onRejected === 'function' && this.rejectedCallbacks.push(onRejected);
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
