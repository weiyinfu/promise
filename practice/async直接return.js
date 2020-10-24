async function haha(x) {
    if (x) return;
    else return 'haha';
}

haha(true).then(x => {
    console.log(x)
})
haha(false).then(x => {
    console.log(x)
})