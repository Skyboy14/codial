module.exports.profile = function (req, res) {
    return res.render('user', {
        title: "Profile"
    })
}