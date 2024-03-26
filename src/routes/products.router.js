const express =require("express");
const ProductManager = require("../Dao/database/Product-manager.db");
const productManager = new ProductManager()
const router =  express.Router()


router.get("/",productManager.getProducts)
router.put("/", productManager.updateProduct)
router.post("/", productManager.addProduct)
router.delete("/", productManager.deletProducts)
router.get("/", productManager.getProductList)
router.get("/", productManager.getProductId)






module.exports= router;
/*
const fs = require('fs').promises;


const ProductManager = require("../Dao/database/Product-manager.db.js");
const productManager =new ProductManager()

//Router
//OBTENER PRODUCTOS
router.get("/", async (req, res) => {
  try {
      const { limit , page , sort, query } = req.query;

      const products = await productManager.getProducts({
          limit: parseInt(limit),
          page: parseInt(page),
          sort,
          query,
      });

      res.json({
          status: 'success',
          payload: products,
          totalPages: products.totalPages,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
          nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
      });

  } catch (error) {
      console.error("Error al obtener products", error);
      res.status(500).json({
          status: 'error',
          error: "Error interno del servidor"
      });
  }
});


//Agregar Productos

router.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    
     const existingProduct = await productManager.getProductsById(newProduct.code);
     if (existingProduct) {
   
       return res.status(400).json({ status: "error", message: "El ID del producto ya existe" });
     }
     await productManager.addProduct(newProduct);
    res.json({ status: "success", message: "Producto Creado" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});
//  ACTUALIZAR PRODUCTOS POR ID
router.put("/products/:pid", async (req, res) => {
  try {
      const productIdToUpdate = req.params.pid;
      const updatedProductData = req.body;

      // Verificar si el producto existe antes de intentar actualizarlo
      const existingProduct = await productManager.getProductsById(productIdToUpdate);
      if (!existingProduct) {
          return res.status(404).json({ status: "error", message: "El producto no se encontró" });
      }

      // Validación de campos obligatorios
      const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];
      const missingFields = requiredFields.filter(field => !updatedProductData[field]);
      if (missingFields.length > 0) {
          return res.status(400).json({ status: "error", message: `Los campos ${missingFields.join(', ')} son obligatorios` });
      }


      // Actualizar el producto
      await productManager.upDateProducts(productIdToUpdate, updatedProductData);
      res.json({ status: "success", message: "Producto actualizado" });
  } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});



 //Ruta DELETE para eliminar un producto por ID
router.delete("/products/:pid", async (req, res) => {
  try {
    const productIdToDelete = req.params.pid;
    const existingProduct = await productManager.getProductsById(productIdToDelete);

    if (!existingProduct) {

      return res.status(404).json({ status: "error", message: "El Producto no existe" });
    }


    await productManager.deleteProduct(productIdToDelete);
    res.json({ status: "success", message: "Producto Eliminado" });

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

  //Limit listar productos
  
  router.get("/products", async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit ||  5;
    try {
        const productList = await productManager.getProducts( limit, page );
        console.log(productList);
        res.status(200).json({productList});
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({ error: "error interno del servidor" });
    }
});

  
  
  //busqueda por id

  router.get("/products/:pid",async(req, res)=>{
    const id= req.params.pid
    try {
      const product = await productManager.getProductsById(id)
      if(!product){
        return res.status(404).json({
          error: "producto no encontrado"
        })
      }
      res.json(product)

    } catch (error) {
      console.error("error al obtener Productos", error);
      res.status(500).json({error:"error interno del servidor"})
    }
  })
  */
 
 