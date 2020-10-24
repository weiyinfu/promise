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

function getSentence(offset) {
    return new Promise((resolve => {
        getSentenceFragment(offset).then(fragment => {
            next = getSentence(offset + 1);
            resolve(fragment + next)
        })
    }));
}

getSentence(0).then(ans => {
    console.log(ans)
});