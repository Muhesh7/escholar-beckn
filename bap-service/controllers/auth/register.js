const bcrypt = require("bcrypt");
var User = require("../../models/user");

exports.register = async (req, res, next) => {
    const { email, name, password, address } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            res.status(409).json({ message: "User already exists" });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const newUser = new User({
                email: email,
                name: name,
                password: hash,
                address, address,
            });
            await newUser.save();
            res.status(201).json({ message: "User created" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Error registering user" });
    }
}