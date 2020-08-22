
const isFunction = function (fn:any) {
  if (typeof fn !== 'function') return false
  return true
}

export default function myPromise(fn: Function) {
  if (!isFunction(fn)) throw Error('Promise resolver undefined is not a function')
  this.events = []
  this.state = 'pending'
  fn.call(undefined, this.resolve.bind(this), this.reject.bind(this))
}

myPromise.prototype.then = function (success?: Function, fail?: Function) {
  if (isFunction(success) || isFunction(fail)) {
    this.events.push([success, fail])
  }
}

myPromise.prototype.resolve = function (value: any) {
  setTimeout(() => {
    if (this.state !== 'pending') return
    this.state = 'fulfilled'
    this.events.map((fn: [Function, Function]) => {
      if (isFunction(fn[0])) {
        fn[0].call(undefined, value)
      }
    })
  })
}

myPromise.prototype.reject = function (reason: any) {
  setTimeout(() => {
    if (this.state !== 'pending') return
    this.state = 'rejected'
    this.events.map((fn: [Function, Function]) => {
      if (isFunction(fn[1])) {
        fn[1].call(undefined, reason)
      }
    })
  })
}

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
