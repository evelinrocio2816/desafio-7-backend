const ProductServices =require("../../Services/productServices")
const productServices = new ProductServices()
const answer= require("../../utils/reusables.js")

class ProductManager{
//OBTENER PRODUCTOS
  async getProducts (req, res)  {
    try {
        const { limit , page , sort, query } = req.query;
  
        const products = await productServices.getProducts({
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
}
//Agregar Productos

 async addProduct(req, res) {
  try {
    const newProduct = req.body;
    
     const existingProduct = await productServices.getProductsById(newProduct.code);
     if (existingProduct) {
   
       return res.status(400).json({ status: "error", message: "El ID del producto ya existe" });
     }
     await productServices.addProduct(newProduct);
    res.json({ status: "success", message: "Producto Creado" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};
//  ACTUALIZAR PRODUCTOS POR ID
 async updateProduct(req, res) {
  try {
      const productIdToUpdate = req.params.pid;
      const updatedProductData = req.body;

      // Verificar si el producto existe antes de intentar actualizarlo
      const existingProduct = await productServices.getProductsById(productIdToUpdate);
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
      await productServices.upDateProducts(productIdToUpdate, updatedProductData);
      res.json({ status: "success", message: "Producto actualizado" });
  } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};
//Ruta DELETE para eliminar un producto por ID
 async deletProducts (req, res) {
  try {
    const productIdToDelete = req.params.pid;
    const existingProduct = await productServices.getProductsById(productIdToDelete);

    if (!existingProduct) {

      return res.status(404).json({ status: "error", message: "El Producto no existe" });
    }

    await productServices.deleteProduct(productIdToDelete);
    res.json({ status: "success", message: "Producto Eliminado" });

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};
 //Limit listar productos
  
  async getProductList (req, res){
  const page = req.query.page || 1;
  const limit = req.query.limit ||  5;
  try {
      const productList = await productServices.getProducts( limit, page );
      console.log(productList);
      res.status(200).json({productList});
  } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({ error: "error interno del servidor" });
  }
};

  //busqueda por id

 async getProductId(req, res){
    const id= req.params.pid
    try {
      const product = await productServices.getProductsById(id)
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
  }
}
module.exports= ProductManager




































  /*
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


module.exports = productServices;


*/
