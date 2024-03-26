const ProductModels =require("../Dao/models/product.model.js");
const answer = require("../utils/reusables.js");


class productServices{

    async addProduct(newObject) {
        let { title, description, price, image, code, stock, category } =
          newObject;
        try {
          if (!title || !description || !price || !code || !stock || !category) {
            console.log("Todos los campos deben ser completados");
            answer(res, 400, "Todos los campos deben ser completados" );
            return;
          }
    
          //Validacion
    
          const productExist = await ProductModels.findOne({code:code });
          if (productExist) {
            console.log("El ya codigo Existe, debe ser unico");
            answer(  res,400, "El código de producto ya existe. Debe ser único.")
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
          answer(res,201, "Producto agregado correctamente")
        } catch (error) {
          console.log("Error al agregar el producto", error);
          answer(res,500,"Error al agregar el producto")
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
            answer(res, 500, "Error al obtener los productos")
      
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
            answer(res,404, "Producto no encontrado" )
            return product
        } catch (error) {
            console.log("error al traer un producto por id");
            answer(res,500, "Error al traer un producto por id")
        }
      }

      async upDateProducts(id, productUpdated) {
        try {
        const updatedProduct= await ProductModels.findByIdAndUpdate(id, productUpdated)
        if(!updatedProduct){
    console.log("no se encuentra el product");
    answer(res,404, "No se encuentra el producto")
    return null;
        }
        console.log("Producto actualizado ");
        return updatedProduct
        } catch (error) {
          console.log("error al actualizar el producto", error);
          answer(res,500, "Error al actualizar el producto")
        }
      }

      async deleteProduct(id) {
        try {
         const Delete = await ProductModels.findByIdAndDelete(id);
          if(!Delete){
            console.log("Producto no encontrado");
            answer( res,404, "Producto no encontrado")
            return null;
          }
          console.log("Producto eliminado correctamente");
        } catch (error) {
          console.log("Error al eliminar el producto", error);
          answer( res,500,"Error al eliminar el producto")
        }
      }
    }


module.exports= productServices;