const CartServices = require("../../Services/cartServices.js")

const cartServices= new CartServices()


class CartsManager{
//1)- Ruta para crear un nuevo carts

async createCart (req, res) {
  try {
    const newCart = await cartServices.createCart();
    res.json(newCart);
    console.log(newCart)
  } catch (error) {
    console.error("Error al crear un nuevo carts", error);
    res.json({ error: "Error del servidor" });
  }
};

//2)-lista de productos de cada carts

 async listCartProducts(req, res) {
  const cartsId = req.params.cid
  try {
    const cart = await cartServices.findById(cartsId)

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
}
//3)-agregar productos al carts
 async addProductToCart (req, res) {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity !== undefined ? Number(req.body.quantity) : 1;
    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ status: "error", message: "La cantidad debe ser un número entero positivo." });
    }
    const updateCart = await cartServices.productsAddToCarts(cartId, productId, quantity);
    res.status(200).json({ status: "success", data: updateCart.products });
  } catch (error) {
    console.error("Error al actualizar el carts", error);
    res.status(404).json({ status: "error", message: "No se puede agregar el producto a un carts no existente." });
  }
};

//4)-Borrar producto especifiico en el carts
 async deleteProductFromCart(req, res)  {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartServices.removeProductFromCart(cartId, productId);
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
};

//5)-actualizar productos en el cart

async updateCartProducts(req, res)  {
 
  const cartId = req.params.cid;
  const products = req.body.products;
   try {
  const updatedCart = await cartServices.updateCart(cartId, products);
      res.json(updatedCart);
    }  
    catch (error) {
      console.error('Error al actualizar el carrito', error);
      res.status(500).json({
          status: 'error',
          error: 'Error interno del servidor',
      });
  }
  
  };
  //6)-actualzar  cantidad de productos en el carts 

 async updateQuantityInCart(req, res) {
  try {
const cartId = req.params.cid;
const productId = req.params.pid;
const quantity = req.body.quantity;

const updatedCart = await cartServices.updateProductQuantity(cartId, productId, quantity);
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
};
  //7)-  DELETE para eliminar todos los productos del carts(Vaciar carrito)
  async deleteCart(req, res) {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartServices.emptyCart(cartId);
  
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
  };
}

module.exports = CartsManager