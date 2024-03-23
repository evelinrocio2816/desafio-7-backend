const express =require("express")
const router = express.Router()
const { isValidPassword } = require("../utils/hashBcrypt.js");

const  UserModel = require("../Dao/models/user.models.js");
const passport = require("passport");



//               LOGOUT


router.get("/logout", async(req,res)=>{
    if(req.session.login){
        req.session.destroy()
    }
    res.redirect("/login");
})
//            VERSION PASSPORT

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/session/faillogin"}),
 async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/products");
})

router.get("/faillogin", async (req, res ) => {
    console.log("Fallo la estrategia")
    res.send({error: "Usuarios y/o contraseñas incorrectos"});
})


///VERSION PARA GITHUB: 

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products");
  }
);
//PASSPORT CON FACEBOOK
router.get("/auth/facebook", passport.authenticate("facebook"));

//RUTA CALLBACK
router.get("/auth/facebook/callback", passport.authenticate("facebook", {successRedirect: "/api/session/profile", failureRedirect:"/login"}));

//RUTA PROTEGIDA DEL LOGIN

router.get('/profile', (req, res) => {
    try {
        // Verificar si el usuario está autenticado
        if (req.isAuthenticated()) {
            // Obtener datos del usuario de Facebook desde la sesión
            const userFacebook = req.user;
            res.render('profile', { userFacebook: userFacebook });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});



//CERRAR SESSION 
router.get("/logout", (req, res) => {
    req.logout( (error) => {
        if(error) {
            console.log(error);
            return res.redirect("/");
        }
        return res.redirect("/login");
    })
})

module.exports = router;