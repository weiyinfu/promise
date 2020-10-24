/*
* yield函数只需要加个*就可以了
* */

function* f() {
    for (let i = 0; i < 10; i++) yield i * 10;
}

for (let i of f()) {
    console.log(i)
}
const x = f()
console.log(x)
console.log(x.next())
while (true) {
    const {value, done} = x.next();
    if (done) break;//当done为true的时候，value=undefined
    console.log(value);
}