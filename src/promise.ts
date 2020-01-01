class P {
    constructor(fn) {
        if (typeof fn !== 'function') {
            throw new Error('parameter is not a function.');
        }
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

    successFns = [];
    failFns = [];
    state = 'pending';

    resolve(arg) {
        setTimeout(() => {
            if (this.state === 'pending' && this.successFns.length > 0) {
                this.successFns.forEach(success => {
                    success.call(undefined, arg);
                });
                this.state = 'fulfilled';
            }
        });
    }

    reject(arg) {
        setTimeout(() => {
            if (this.state === 'pending' && this.failFns.length > 0) {
                this.failFns.forEach(fail => {
                    fail.call(undefined, arg)
                });
                this.state = 'rejected';
            }
        });
    }

    then(success, fail?) {
        if (typeof success === 'function') this.successFns.push(success);
        if (typeof fail === 'function') this.failFns.push(fail);
    }
}

export default P;
