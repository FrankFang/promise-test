type ResolveFn = (result?: unknown) => void
type RejectFn = (reason?: unknown) => void
type PromiseState = 'pending' | 'fulfilled' | 'rejected'
class MyPromise {
  successes: ResolveFn[] = [];
  fails: RejectFn[] = [];

  state: PromiseState = 'pending';

  constructor (execute: (resolve: ResolveFn, reject: RejectFn) => void) {
    if (typeof execute !== 'function') throw new Error('参数只能是函数');
    const resolve = this.resolve.bind(this), reject = this.reject.bind(this);
    execute(resolve, reject);
  }

  resolve (result?: unknown): void {
    // setTimeout会在then方法执行后再执行
    setTimeout(() => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.successes.forEach(success => success.call(undefined, result));
      }
    });
  }

  reject (reason?: unknown): void {
    setTimeout(() => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.fails.forEach(fail => fail.call(undefined, reason));
      }
    });
  }

  then (success: any, fail?: any) {
    (typeof success === 'function') && (this.successes.push(success));
    (typeof fail === 'function') && (this.fails.push(fail));
  }
}

export default MyPromise;


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
