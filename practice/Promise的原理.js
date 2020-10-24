/**
 * Promise是语法糖还是底层机制？
 * 自己实现的Promise正确与否就看最后抛异常时候的异常栈是怎样的：
 * 正确的promise堆栈只有一层，错误的promise堆栈还是有多层。
 * */
class Pro {
    fun = null;//主要函数
    res = null;//fun的运行结果
    status = "pending";

    constructor(fun) {
        this.fun = fun;
    }

    then(callback) {
        this.res = null
        this.fun((args) => {
            this.res = callback(args)
            this.status = "resolved"
        })
        if (this.res instanceof Pro) {
            return this.res
        } else {
            return new Pro(resolve => {
                resolve(this.res)
            });
        }
    }
}

function f() {
    return new Pro(resolve => {
        console.log('haha')
        setTimeout(() => {
            resolve('first')
        }, 1000)
    })
}

let x = f().then((msg) => {
    console.log(msg)
    return new Pro(resolve => {
        resolve('second')
    })
}).then((msg) => {
    console.log(msg)
    // throw "baga";
}).then(() => {
    console.log("three")
    return 'why'
}).then((msg) => {
    console.log(msg)
}).then(() => {
    throw 'over';
})
console.log(x)
