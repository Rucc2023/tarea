const express = require('express');
const Router = express.Router();
const db = require("../dbconnection");

// ================================= add Product  ================================
Router.get('/addProduct', (req, res) => {
    let sql = "SELECT * FROM category";
    db.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('addProduct', {
            rows: rows
        });
    });
});

Router.post("/addProduct", (req, res) => {
    let product_name = req.body.name;
    let product_price = req.body.price;
    let product_category = req.body.category; // Cambia id_spct a category

    let query = "INSERT INTO `product` (name_p, price, category) VALUES (?, ?, ?)"; // Usa parámetros
    db.query(query, [product_name, product_price, product_category], (err, result) => {
        if (err) {
            console.error("Error inserting product: ", err); // Para depurar errores
            return res.status(500).json({ error: "Database insert failed" }); // Enviar error en JSON
        }
        return res.redirect('/'); // Redirigir solo si el producto se insertó correctamente
    });
});

// ================================= edit Product ================================
// ================================= edit Product ================================
Router.get("/editProduct/:idProduct", (req, res) => {
    let idProduct = req.params.idProduct;

    // Obtener los datos del producto y las categorías
    let sql = "SELECT * FROM product WHERE idp = ?";
    db.query(sql, [idProduct], (err, productResult) => {
        if (err) throw err;

        let categorySql = "SELECT * FROM category";
        db.query(categorySql, (err, categoryRows) => {
            if (err) throw err;
            res.render('editProduct', {
                idp: idProduct,
                row: productResult[0], // Asumir que solo hay un producto
                rows: categoryRows
            });
        });
    });
});

Router.post("/editProduct/:idProduct", (req, res) => {
    let idProduct = req.params.idProduct;
    let product_name = req.body.name;
    let product_price = req.body.price;
    let product_category = req.body.category;

    let query = "UPDATE `product` SET `name_p` = ?, `price` = ?, `category` = ? WHERE `idp` = ?";
    db.query(query, [product_name, product_price, product_category, idProduct], (err, result) => {
        if (err) {
            console.error("Error updating product: ", err);
            return res.status(500).json({ error: "Database update failed" });
        }
        res.redirect('/');
    });
});

// ================================= delete Product ================================
Router.get("/deleteProduct/:idProduct", (req, res) => {
    let idProduct = req.params.idProduct;
   
    let query = 'DELETE FROM product WHERE idp = ?';
    db.query(query, [idProduct], (err, result) => {
        if (err) {
            console.error("Error deleting product: ", err); // Para depurar errores
            return res.status(500).json({ error: "Database delete failed" }); // Enviar error en JSON
        }
        res.redirect('/');
    });
});

module.exports = Router;
