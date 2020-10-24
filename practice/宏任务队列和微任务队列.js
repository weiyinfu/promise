/**
 * process.nextTick是microTasks，所以先执行
 * 而setTimeout是macroTasks，所以后执行
 * */

console.log('main start');

setTimeout(() => {
    console.log('setTimeout');
    process.nextTick(() => console.log('process.nextTick 3'));
}, 0);

process.nextTick(() => {
    console.log('process.nextTick 1');
    process.nextTick(() => console.log('process.nextTick 2'));
});

console.log('main end');