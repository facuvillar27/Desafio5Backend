import dotenv from "dotenv";
import User from "../models/user.model.js";
import Products from "../dao/dbManager/products.js";
import { Router } from "express";

const router = Router();

dotenv.config();
const productManager = new Products();

router.get("/products", async (req, res) => {
    try {
        let user = null;
        // Verifica si hay un usuario en la sesión
        if (req.session.user) {
            // Si el usuario es autenticado a través de GitHub, el objeto de usuario se almacena en la sesión
            let user = req.session.user;
        } else {
            // Si el usuario no está autenticado a través de GitHub, busca al usuario por correo electrónico
            let user = await User.findOne({ email: req.session.email });
        }
        console.log(user);
        if (!user) {
            throw new Error("No se encontró el usuario");
        }

        const result = await productManager.getFilteredProducts(req);
        const productsRender = result.docs.map(doc => doc.toObject());
        const userName = user.first_name + " " + user.last_name;
        const userEmail = user.email;
        const role = req.session.role;

        res.render("products", {
            products: productsRender,
            user: userName,
            role: role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Error al obtener productos" });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/login');
        }
        res.clearCookie('sid');
        res.redirect('/login');
    });
});

router.get('/', (req, res) => {
    res.render("home")
});

router.get('/login', (req, res) => {
    res.render("login")
});

export default router;