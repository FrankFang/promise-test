class Promise2 {
	state = "pending";
	callbacks = [];

	resolve(result) {
		if (this.state !== 'pending') return;
		this.state='fulfilled'
		setTimeout(()=>{
			this.callbacks.forEach(item=>{
				if(typeof item[0] ==='function'){
					item[0].call(undefined,result)
				}
			})
		},0)
	}

	reject(reason) {
		if (this.state !== 'pending') return;
		this.state='rejected'
		setTimeout(()=>{
			this.callbacks.forEach(item=>{
				if(typeof item[1]==='function'){
					item[1].call(undefined,reason)
				}
			})
		},0)
	}

	constructor(fn) {
		if (typeof fn !== 'function') {
			throw new Error('promise直接收函数');
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
