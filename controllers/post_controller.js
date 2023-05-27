module.exports.post = function (req, res) {
    res.end('< h1 > Enter your post here</h1 > <input/>');
}

module.exports.comment = function (req, res) {
    res.end('<>< h1 > Enter your comment here</h1 ></>');
}

module.exports.feedback = function (req, res) {
    res.end('< h1 > Enter your feedback here</h1 >');
}