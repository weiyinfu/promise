function go(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x)
        }, x)
    })
}

const x = Promise.all([go(1000), go(2000)])
console.log(x)
x.then(resp => {
    console.log(resp);
})
const y = Promise.race([go(1000), go(2000)])
y.then(resp => {
    console.log('y==')
    console.log(resp)
})