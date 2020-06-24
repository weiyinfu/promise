module.exports = {
  deferred() {
    let x = {}
    x.promise = new Promise((resolve, reject) => {
      x.resolve = resolve;
      x.reject = reject;
    })
    return x;
  }
}