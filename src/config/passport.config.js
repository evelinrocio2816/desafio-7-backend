const passport = require("passport");
const local = require("passport-local");

const GithubUserModel = require("../Dao/models/githubUser.models")
const UserModelfacebook = require("../Dao/models/facebookUser.models")
const UserModel = require("../Dao/models/user.models");
const { createHash, isValidPassword } = require("../utils/hashBcrypt");
//GitHub
const GitHubStrategy = require("passport-github2");
//Facebook
const FacebookStrategy =require("passport-facebook")
/*   Passport-local */

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);
          //si no existe creo un nuevo usuario

          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //ESTRATEGIA PARA EL LOGIN

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //verifico si existe el usuario con ese mail
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("El usuario no existe");
            return done(null, false);
          }
          //si existe verifico la contraseña

          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /* PASSPORT CON GITHUB */

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.bbd6c94a8d592fa9",
        clientSecret: "31a0a8185f59ab6d185ae68eba993dcb3ec7b6da",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile:", profile);
        try {
          let user = await GithubUserModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 29,
              email: profile._json.email,
              password: ""
            }
            let result = await GithubUserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //PASSPORT CON FACEBOOK

  passport.use(new FacebookStrategy({
    clientID:  639889558266038,
    clientSecret: "5b8a79ec027964a48240ecbdc85f0af5",
    callbackURL: "http://localhost:8080/api/session/auth/facebook/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const user = await UserModelfacebook.findOne({
        accountId: profile.id,
        provider: "Facebook"
    });

    if (!user) {
        console.log("Agregando un usuario");
        const newUser = new UserModelfacebook({
            first_name: profile.displayName,
            accountId: profile.id,
            provider: "Facebook"
        });
        await newUser.save();
        return done(null, profile);
    } else {
        console.log("El usuario ya existe ");
        return done(null, profile);
    }
}))

//Serializar y deserializar al usuario
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})
};

module.exports = initializePassport;
