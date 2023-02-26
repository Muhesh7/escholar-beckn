const passport = require("passport");

exports.login = async (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: "User logged in" });
        });
    })(req, res, next);
};

exports.user = async (req, res) => {
    try {
        console.log(req.user)
        return res.send({ name: req.user.name, email: req.user.email });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting user' });
    }
}

exports.logout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.status(200).json({ message: "User logged out" });
    });
};