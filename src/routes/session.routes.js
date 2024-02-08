import { Router } from "express";
import User from "../models/user.model.js";
import { auth } from "../middlewares/index.js";
import passport from "passport";
import { generateToken, authToken, createHash } from "../utils.js";

const router = Router();

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
);

router.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        req.session.user = req.user
        req.session.admin = "true"
        console.log(req.session)
        res.redirect("/products")
    });

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const result = await User.findOne({ email, password });
    
    if (result === null || !isValidPassword(result, password)) {
        res.status(400).json({
            message: "Usuario o contraseña incorrectos",
        });
    } else {
        let role = "user"
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            role = "admin"
        }
        req.session.user = email;
        req.session.role = role;
        const access_token = generateToken(result);
        res.status(200).json({
            message: "Login OK",
            role,
            access_token
        });
    }
    const access_token = generateToken(result);
    res.send({status: "success", access_token})
});

router.get("/current", authToken, (req, res) => {
    res.send({ status: "success", payload: req.user});
})


router.post("/signup", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    const newUser = {
         first_name,
         last_name,
         email,
         password: createHash(password),
         age,
         role: "user",
    };

    const user = new User(newUser);
    const access_token = generateToken(user);
    
    const result = await user.save();
    
    if (result === null) {
        return res.status(400).json({
            message: "Error al crear el usuario",
        });
    } else {
        req.session.user = email;
        req.session.role = newUser.role || "user";
        res.status(201).json({
            message: "Usuario creado con éxito",
            user: result,
        });
    }
    res.send({status: "success", access_token})
});

router.get("/privado", auth, (req, res) => {
    res.render("topsecret", {
        title: "Privado",
        user: req.session.user,
    });
});

export default router;