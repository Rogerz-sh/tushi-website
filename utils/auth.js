
module.exports = {
    checkLogin: function (req, res, next) {
        if (req.session.account) {
            next();
        } else {
            res.redirect('/manage/login')
        }
    }
}