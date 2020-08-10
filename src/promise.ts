class Promise2 {
  state = 'pending';
  callbacks = [];

  resolve(result) {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    setTimeout(() => {
      this.callbacks.forEach(handle => {
        if (typeof handle[0] === 'function') {
          handle[0].call(undefined, result);
        }
      });
    }, 0);
  }

  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    setTimeout(() => {
      this.callbacks.forEach(handle => {
        if (typeof handle[1] === 'function') {
          handle[1](reason);
        }
      });
    }, 0);
  }

  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('劳资只接收函数');
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  then(succeed?, fail?) {
    const handle = [];
    if (typeof succeed === 'function') {
      handle[0] = succeed;
    }
    if (typeof fail === 'function') {
      handle[1] = fail;
    }
    this.callbacks.push(handle);
  }
}

export default Promise2;

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === 'function') {
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
