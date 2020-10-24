/*
* 连续promise需要依赖then返回新的Promise
* */
function f() {
    return new Promise(resolve => {
        resolve("haha")
    });
}

f().then(x => {
    console.log(x)
    return new Promise(resolve => {
        resolve('baga')
    })
}).then(y => {
    console.log(y)
})