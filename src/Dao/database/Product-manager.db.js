const ProductModels = require("../models/product.model.js");
const answer = require("../../utils/reusables.js");

class ProductManager {
  async getProducts(req, res) {
    try {
      const products = await ProductModels.find();
      answer(res, 200, products);
    } catch (error) {
      answer(res, 500, "Error al obtener los Productos", error);
     
    }
  
  }

  async postProducts(req, res) {
    try {
      const newProduct = req.body;
      // Verificar si ya existe un producto con el mismo código
      const existingProduct = await ProductModels.findOne({ code: newProduct.code });
      if (existingProduct) {
        return answer(res, 409, "Ya existe un producto con este código.");
      }
      // Si no hay ningún producto con el mismo código, proceder con la inserción
      await ProductModels.create(newProduct);
      answer(res, 201, "Producto creado exitosamente");
    } catch (error) {
      console.error("Error al crear un nuevo producto:", error);
      answer(res, 500, "Error al crear un nuevo producto. Por favor, inténtelo de nuevo más tarde.");
    }
  }
}

module.exports = ProductManager;



/*const ProductModels= require("../models/product.model.js");

class ProductManager {
  async addProduct(newObject) {
    let { title, description, price, image, code, stock, category } =
      newObject;
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos deben ser completados");
        return;
      }

      //Validacion

      const productExist = await ProductModels.findOne({code:code });

      if (productExist) {
        console.log("El ya codigo Existe, debe ser unico");
        return;
      }
      const newProduct = new ProductModels({
        title,
        description,
        price,
        image,
        code,
        stock,
        category,
        status: true,
       
      });
      await newProduct.save();

    } catch (error) {
      console.log("Error al agregar el producto", error);
    }
  }


  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
        const skip = (page - 1) * limit;

        let queryOptions = {};

        if (query) {
            queryOptions = { category: query };
        }

        const sortOptions = {};
        if (sort) {
            if (sort === 'asc' || sort === 'desc') {
                sortOptions.price = sort === 'asc' ? 1 : -1;
            }
        }

        const products = await ProductModels
            .find(queryOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalProducts = await ProductModels.countDocuments(queryOptions);

        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        return {
            docs: products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
        };

      } catch (error) {
        console.log("Error al obtener los productos", error);
        throw error;
    }
}




  async getProductsById(id){
    try {
        const product = await ProductModels.findById(id)
        if(!product){
            console.log("Producto no encontrado");
            return null
        }
        console.log("Producto encontradoo");
        return product
    } catch (error) {
        console.log("error al traer un producto por id");
    }
  
  }


  async upDateProducts(id, productUpdated) {
    try {
    const updatedProduct= await ProductModels.findByIdAndUpdate(id, productUpdated)

    if(!updatedProduct){
console.log("no se encuentra el product");
return null;

    }
    console.log("Producto actualizado ");
    return updatedProduct

    } catch (error) {
      console.log("error al actualizar el producto", error);
    }
  }

  
  async deleteProduct(id) {
    try {
     const Delete = await ProductModels.findByIdAndDelete(id);

      if(!Delete){
        console.log("Producto no encontrado");
        return null;
      }
      console.log("Producto eliminado correctamente");

    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

module.exports = ProductManager  ;*/
