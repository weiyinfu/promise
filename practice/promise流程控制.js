/**
 * Promise的流程控制包括then，catch，finally
 * */
function f(x) {
    if (x) return Promise.resolve(x)
    return Promise.reject(x)
}

f(true).then(resp => {
    console.log("ok " + resp)
}).finally(() => {
    console.log('finally')
})
f(false).then(resp => {
    console.log("ok " + resp)
}).catch(x => {
    console.log('error ' + x)
}).finally(() => {
    console.log('finally')
})