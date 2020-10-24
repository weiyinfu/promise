/**
 * 不需要使用new Promise，直接使用Promise.resolve,reject函数即可
 * */
function f() {
    return Promise.resolve(3)
}

function ff() {
    return new Promise(resolve => {
        resolve(3)
    })
}

f().then(resp => console.log(resp))
ff().then(resp => console.log(resp))