const express =require("express")
const router = express.Router()

const  UserModel = require("../Dao/models/user.models.js");
const passport = require("passport");



//REGISTRO CON PASSPORT

router.post("/", passport.authenticate("register", {
    failureRedirect:"/api/users/failedregister"
}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send({error: "Registro fallido"});
})



module.exports= router;