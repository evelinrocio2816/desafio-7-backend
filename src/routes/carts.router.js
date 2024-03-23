const express = require("express");
const router = express.Router();

const CartsManager = require("../Dao/database/Cart-manager.db.js");
const cartsManager = new CartsManager();
const CartModels= require("../Dao/models/cart.models.js")

//1)- Ruta para crear un nuevo carts

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.json(newCart);
    console.log(newCart)
  } catch (error) {
    console.error("Error al crear un nuevo carts", error);
    res.json({ error: "Error del servidor" });
  }
});


//Routes
//2)-lista de productos de cada carts

router.get("/:cid", async (req, res) => {
  const cartsId = req.params.cid
  try {
    const cart = await CartModels.findById(cartsId)

    if (!cart) {
      res.status(404).json({ message: "El ID es invalido" })
    //  return res.status(404).json({ error: "Carrito no encontrado" });

    }else{

        res.json(cart.products)
    }
    
  } catch (error) {
    console.error("Error al obtener el carts", error);
    res.status(500).json({ error: "error interno del servidor" })
  }
})

//3)-agregar productos al carts
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const quantity = req.body.quantity !== undefined ? Number(req.body.quantity) : 1;

    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ status: "error", message: "La cantidad debe ser un número entero positivo." });
    }


    const updateCart = await cartsManager.productsAddToCarts(cartId, productId, quantity);
    res.status(200).json({ status: "success", data: updateCart.products });
  } catch (error) {
    console.error("Error al actualizar el carts", error);
    res.status(404).json({ status: "error", message: "No se puede agregar el producto a un carts no existente." });
  }
});



//4)-Borrar producto especifiico en el carts
// Delete product from cart
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartsManager.removeProductFromCart(cartId, productId);
    res.json({
      status: 'success',
      message: 'Producto eliminado del carrito correctamente',
      updatedCart,
  });
} catch (error) {
  console.error('Error al eliminar el producto del carrito', error);
  res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor',
  });
}
});



//5)-actualizar productos en el cart
// Update cart with products
router.put("/:cid", async (req, res) => {
 
const cartId = req.params.cid;
const products = req.body.products;
 try {
const updatedCart = await cartsManager.updateCart(cartId, products);
    res.json(updatedCart);
  }  
  catch (error) {
    console.error('Error al actualizar el carrito', error);
    res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
    });
}

});


//6)-actualzar  cantidad de productos en el carts 
// Update product quantity in cart
router.put("/:cid/products/:pid", async (req, res) => {
  try {
const cartId = req.params.cid;
const productId = req.params.pid;
const quantity = req.body.quantity;

const updatedCart = await cartsManager.updateProductQuantity(cartId, productId, quantity);
    res.json({
      status: 'success',
      message: 'Cantidad del producto actualizada correctamente',
      updatedCart
    });
  
  }catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito', error);
    res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
    });
}
});


  //7)-  DELETE para eliminar todos los productos del carts(Vaciar carrito)
router.delete('/:cid', async (req, res) => {
  try {
      const cartId = req.params.cid;
      
      const updatedCart = await cartsManager.emptyCart(cartId);

      res.json({
          status: 'success',
          message: 'Todos los productos del carrito fueron eliminados correctamente',
          updatedCart,
      });
  } catch (error) {
      console.error('Error al vaciar el carrito', error);
      res.status(500).json({
          status: 'error',
          error: 'Error interno del servidor',
      });
  }
});


module.exports = router;