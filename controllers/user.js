const { v4: uuidv4 } = require('uuid');
const { setUser } = require('../service/auth');
const User = require("../models/user");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    await User.create({
        name,
        email,
        password,
    });

    return res.redirect("/login");  // go to login after signup
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
        email,
        password,
    });

    if (!user) {
        return res.render("login", {
            error: "invalid username or password",
        });
    }

    // create token from your setUser()
    const token = setUser(user);

    // ✅ match cookie name with middleware
    res.cookie("token", token);  

    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin
};
