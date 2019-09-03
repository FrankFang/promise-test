class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    console.log('1')
  }
  reject(reason) {
    /* 完善 */
  }
  constructor(fn) {
    /* 完善 */
  }
  then(succeed?, fail?) {
    /* 完善 */
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
