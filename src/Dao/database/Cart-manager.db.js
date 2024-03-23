const CartModels = require("../models/cart.models.js");


class CartManager {
  async createCart() {
    try {
      const newCart = new CartModels({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("error al crear el carrito");
    }
  }
  async getCartById(cartId) {
    try {
        const cart = await CartModels.findById(cartId);
        if (!cart) {
            console.log("No existe ese carrito");
            return null
        }
       // return cart
        // { status: 200, cart };
    } catch (error) {
        console.log("error al traer el carrito");
        return { status: 500, message: "Error interno del servidor" };
    }
}


//AGREGAR PRODUCTOS AL CARRITO
 async productsAddToCarts(cartId, productId, quantity = 1) {
   try {
     const cart = await this.getCartById(cartId);
 
     // Verificar si el carrito existe y tiene la propiedad products
     if (!cart || !cart.products) {
       console.log("Error: El carrito no existe o no tiene la propiedad 'products'");
       return null;
     }
 
      // Verificar si el producto ya existe en el carrito
      const productExistIndex = cart.products.findIndex(
        (item) => item.product && item.product.toString() === productId
      );
  
      if (productExistIndex !== -1 && cart.products[productExistIndex]) {
        // El producto ya existe en el carrito, actualizar la cantidad
        cart.products[productExistIndex].quantity += quantity;
      } else {
        // El producto no existe o no está inicializado, agregarlo al carrito
        cart.products.push({ product: productId, quantity });
      }
  
      // Marcar la propiedad products como modificada antes de guardar
      cart.markModified("product");
  
      // Guardar el carrito actualizado
      await cart.save();
  
      return cart;
    } catch (error) {
      console.log("Error al agregar productos al carrito", error);
      return null;
    }
  }

/////////////////////////////////////////////////////////////////////////////////////////////////
//ELIMINAR PRODUCTO DEL CARRITO
  async removeProductFromCart (cartId, productId) {
    try {
        const cart = await CartModels.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }//

        //cart.products = cart.products.filter(item => item.product.toString() !== productId);
        cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

        await cart.save();
        return cart;
    } catch (error) {
        console.error('Error al eliminar el producto del carrito en el gestor', error);
        throw error;
    }
}

//ACTUALIZAR CARRITO

async updateCart(cartId, updatedProducts) {
    try {
        const cart = await CartModels.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = updatedProducts;

        cart.markModified('products');

        await cart.save();

        return cart;
    } catch (error) {
        console.error('Error al actualizar el carrito en el gestor', error);
        throw error;
    }
}
//ACTUALIZAR CANTIDAD DE PRODUCTOS

async updateProductQuantity(cartId, productId, newQuantity) {
    try {
        const cart = await CartModels.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = newQuantity;


            cart.markModified('products');

            await cart.save();
            return cart;
        } else {
            throw new Error('Producto no encontrado en el carrito');
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        throw error;
    }
}

async emptyCart(cartId) {
    try {
        const cart = await CartModels.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        return cart;
    } catch (error) {
        console.error('Error al vaciar el carrito en el gestor', error);
        throw error;
    }
}

}
  

module.exports = CartManager;
