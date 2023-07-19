const mongoose = require("mongoose");
const faker = require("faker");

const productSchema = mongoose.Schema({
  productId: String,
  price: String,
  quantity: Number,
  name: String,
  category: String,
});

const ProductData = mongoose.model("product", productSchema);

ProductData.find({})
  .then((data) => {
    if (data.length <= 0) {
      fnInsertRecords()
      console.log("Product data inserted successfully")
    } else {
      console.log(`There are "${data.length}" products`)
    }
  })
  .catch((err) => {
    console.error("Data retrieval failed:", err)
  });

function generateSalesData() {
  const productData = [];
  for (let i = 0; i < 100; i++) {
    productData.push({
      productId: "testProduct" + faker.random.number({ min: 1, max: 10 }),
      price: faker.commerce.price({ min: 100, max: 10000 }),
      quantity: faker.random.number({ min: 0, max: 100 }),
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
    });
  }
  return productData;
}

// Insert the data into MongoDB
function fnInsertRecords() {
  ProductData.insertMany(generateSalesData())
    .then(() => {
      console.log("Data inserted successfully.");
      // mongoose.connection.close(); // Close the connection after insertion
    })
    .catch((err) => {
      console.error("Data insertion failed: ", err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
}

module.exports = mongoose.model("product", productSchema);