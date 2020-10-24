function ff() {
    return new Promise(resolve => {
        console.log("haha")
        resolve('first')
    })
}

var y = ff().then(msg => {
    console.log(msg)
    return new Promise(resolve => {
        resolve('second')
    })
}).then(msg => {
    console.log(msg)
    // throw 'baga';
}).then(() => {
    console.log('three')
    return 'four'
}).then(msg => {
    console.log(msg)
}).then(() => {
    throw 'over';
})
console.log(y);
