const mongoose = require("mongoose");
const faker = require("faker");

const orderSchema = mongoose.Schema({
  orderId: String,
  orderDate: String,
  quantity: Number,
  revenue: Number,
  productId: String,
  region: String,
});

const OrderData = mongoose.model("order", orderSchema);

OrderData.find({})
  .then((data) => {
    if (data.length <= 0) {
      fnInsertRecords()
      console.log("Orders data inserted successfully")
    } else {
      // console.log("Orders Data fetched successfully:", data.length)
      console.log(`There are "${data.length}" orders`)
    }
  })
  .catch((err) => {
    console.error("Data retrieval failed:", err);
  });

function generateSalesData() {
  const orderData = [];
  for (let i = 0; i < 100; i++) {
    orderData.push({
      orderId: faker.commerce.productName(),
      orderDate: faker.date.weekday(),
      quantity: faker.random.number({ min: 0, max: 100 }),
      revenue: faker.random.number({ min: 500, max: 100000 }),
      productId: "testProduct" + faker.random.number({ min: 1, max: 10 }),
      region: faker.address.country(),
    });
  }
  return orderData;
}

// Insert the data into MongoDB
function fnInsertRecords() {
  OrderData.insertMany(generateSalesData())
    .then(() => {
      console.log("Data inserted successfully.");
      mongoose.connection.close(); // Close the connection after insertion
    })
    .catch((err) => {
      console.error("Data insertion failed: ", err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
}

module.exports = mongoose.model("order", orderSchema);