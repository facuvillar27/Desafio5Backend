import { Router } from "express";
import User from "../models/user.model.js";
import { auth } from "../middlewares/index.js";

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const result = await User.findOne({ email, password });
    
    if (result === null) {
        res.status(400).json({
            message: "Usuario o contraseña incorrectos",
        });
    } else {
        req.session.user = email;
        if (req.session.email === "adminCoder@coder.com" && req.session.password === "adminCod3r123") {
            req.session.role = "admin";
        } else {
            req.session.role = "user";
        }
        res.status(200).json({
            message: "Login OK"
        });
    }
});

router.post("/signup", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    const newUser = {
        first_name,
        last_name,
        email,
        password,
        age,
        role: "user",
    };

    const user = new User(newUser);

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
});

router.get("/privado", auth, (req, res) => {
    res.render("topsecret", {
        title: "Privado",
        user: req.session.user,
    });
});

export default router;