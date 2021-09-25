class Promise2 {
  state = 'pending';
  eventQueue = [];
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise only receive function');
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(result) {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    setTimeout(() => {
      this.eventQueue.forEach(handles => {
        if (typeof handles[0] === 'function') {
          handles[0].call(undefined, result);
        }
      });
    });
  }
  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    setTimeout(() => {
      this.eventQueue.forEach(handles => {
        if (typeof handles[1] === 'function') {
          handles[1].call(undefined, reason);
        }
      });
    });
  }
  then(resolve, reject) {
    const handles = [];
    if (typeof resolve === 'function') {
      handles[0] = resolve;
    }
    if (typeof reject === 'function') {
      handles[1] = reject;
    }
    this.eventQueue.push(handles);
    return this;
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
