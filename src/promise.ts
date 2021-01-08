class Promise2 {
    callbacks=[];
    state='pending'
    resolve(result){
        if(this.state==='fulfilled') return;
        this.state='fulfilled';
        setTimeout(()=>{
            this.callbacks.forEach(callback=>{
                if(typeof callback[0]==='function'){
                    callback[0].call(undefined,result);
                }
            })
        },0);
    }
    reject(reason){
        if(this.state==='rejected') return;
        this.state='rejected';
        setTimeout(()=>{
            this.callbacks.forEach(callback=>{
                if(typeof callback[1]==='function'){
                    callback[1].call(undefined,reason);
                }
            })
        },0);
    }
    constructor(fn) {
        if(typeof fn!=='function'){
            throw new Error('Promise只接受一个函数参数');
        }
        fn(this.resolve.bind(this),this.reject.bind(this));
    }
    then(resolve?,reject?){
        const callback=[];
        if(typeof resolve==='function'){
            callback[0]=resolve;
        }
        if(typeof reject==='function'){
            callback[1]=reject;
        }
        this.callbacks.push(callback);
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
