let passage = "one two three four".split(/\s+/)
let pages = [];
for (let i = 0; i < passage.length; i++) {
    pages.push({
        data: passage[i],
        nextPage: i + 1 < passage.length ? i + 1 : null,
    });
}

function getSentenceFragment(offset) {
    return new Promise(((resolve, reject) => {
        if (offset === 3) {
            throw "over";
        }
        resolve(pages[offset]);
    }));
}

let getSentence = (offset = 0) =>
    getSentenceFragment(offset)
        .then(fragment => {
            if (fragment.nextPage) {
                return getSentence(fragment.nextPage)
                    .then(nextFragment => fragment.data.concat(nextFragment))
            } else {
                return fragment.data;
            }
        });
/**
 * Promise不调用then就不会执行
 * */
let x = getSentence(0);
console.log(x);
x.then(ans => {
    console.log(ans)
});