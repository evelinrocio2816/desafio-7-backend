const mongoose = require("mongoose");
const mongoosePaginate =require("mongoose-paginate-v2") 

const CartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
// Middleware pre que realiza la población automáticamente
CartSchema.pre('findOne', function (next) {
  this.populate('products.product', '_id title price');
  next();
});

CartSchema.plugin(mongoosePaginate)
const CartModels =mongoose.model("carts", CartSchema)
module.exports= CartModels;