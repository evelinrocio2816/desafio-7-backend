const express = require("express");
const ProductManager = require("../Dao/database/Product-manager.db");
const productManager = new ProductManager();
const CartManager= require("../Dao/database/Cart-manager.db");
const session = require("express-session");
const cartsManager= new CartManager()
const router = express.Router()
const fs = require('fs').promises;

                

router.get("/", async (req, res) => {
  res.render("login",{title:"home"})
 });
//   Carritoo

router.get("/carts", async (req, res) => {
   res.render("carts",{title:"carts"})
  });




 router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
  
    try {
       const carts = await cartsManager.getCartById(cartId);
  
       if (!carts) {
          console.log("No existe ese carts con el id");
          return res.status(404).json({ error: "carrito no encontrado" });
       }
  
       const productsInCart = carts.products.map(item => ({
          product: item.product,
          //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
          quantity: item.quantity
       }));
  
  
       res.render("carts", { products: productsInCart });
    } catch (error) {
       console.error("Error al obtener el carts", error);
       res.status(500).json({ error: "Error interno del servidor" });
    }
  });

 //                        Chat
 
router.get("/chat", async (req, res) => {
   res.render("chat",{title:"chat"})
  });
//                    Ruta de Productos

router.get("/products", async (req, res) => {
   try {
      const { page=4 , limit=5 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });
 
      const newArray = products.docs.map(prod => {
         const { _id, ...rest } = prod.toObject();
         return rest;
      });
 
      res.render("products", {
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages,
         user: req.session.user
      });
 
   } catch (error) {
      console.error("Error al obtener products", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
 });



//                      Ruta para formilario de registro
router.get("/login", (req, res) => {
   // Verifica si el usuario ya está logueado y redirige a la página de perfil si es así
   if (req.session.login) {
       return res.redirect("/profile");
   }

   res.render("login");
});

router.get("/register", async (req, res)=>{

   if(req.session.login){
    return  res.redirect("/profile")
   }
   res.render("register")
})

//       Ruta para la vista del profile


router.get("/profile", async(req,res)=>{

   if(!req.session.login){
      return res.redirect("/login")
   }
   
   res.render("profile", { user: req.session.user });

})


 module.exports = router;