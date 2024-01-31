import express from "express";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Products from "../dao/dbManager/products.js";

dotenv.config();
const router = express.Router();
const productManager = new Products();

router.get("/products", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.session.user });
        const result = await productManager.getFilteredProducts(req);
        const productsRender = result.docs.map(doc => doc.toObject())
        const userName = user.first_name + " " + user.last_name;
        const userEmail = user.email;
        const userPassword = user.password;
        let role = "";
        if (userEmail === "adminCoder@coder.com" && userPassword === "adminCod3r123") {
            role = "admin";
        } else {
            role = "user";
        }
        res.render("products", { products: productsRender, user: userName, role: role})
    } catch (error) {
        console.error(error); // Imprime el error completo
        res.status(500).json({ status: 'error', error: "Error al obtener productos" })
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


export default router;