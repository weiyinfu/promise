var count = 0;

//setTimeout是没问题的
function timer() {
    var id = setTimeout(timer, 1000);
    console.log(count++);
    if (count === 4) {
        clearTimeout(id);
        throw "haha";
    }
}

timer()