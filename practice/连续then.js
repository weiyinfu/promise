/**
 * 当Promise中没有调用resolve时，then函数一定不会执行
 * */
function f(x) {
    return new Promise(((resolve, reject) => {
        if (x)
            resolve('haha');
    }));
}

for (let i of [true, false]) {
    console.log(`=========${i}===========`)
    f(i).then(x => {
        console.log(x)
    }).then((x) => {
        console.log(arguments.length)
    });
}
