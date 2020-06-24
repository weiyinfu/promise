module.exports = {
  deferred() {
    let yes, no;
    return {
      promise: new Promise((resolve, reject) => {
        yes = resolve;
        no = reject;
      }),
      resolve: yes,
      reject: no,
    }
  }
}