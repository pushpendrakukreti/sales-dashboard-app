const mongoose = require("mongoose");
const faker = require("faker");

const salesDataSchema = new mongoose.Schema({
  product: String,
  salesRevenue: Number,
  region: String,
  order: Number,
  category: String,
  date: String,
  price: String,
});

const SalesData = mongoose.model("SalesData", salesDataSchema);

function generateSalesData() {
  const salesData = [];
  for (let i = 0; i < 100; i++) {
    salesData.push({
      product: faker.commerce.productName(),
      salesRevenue: faker.random.number({ min: 50, max: 100 }),
      region: faker.address.country(),
      order: faker.random.number({ min: 1, max: 100 }),
      price: faker.commerce.price({ min: 100, max: 10000 }),
      category: faker.commerce.department(),
      date: faker.datatype.datetime(),
    });
  }
  return salesData;
}

// Insert the data into MongoDB
SalesData.insertMany(generateSalesData())
  .then(() => {
    console.log("Data inserted successfully.");
    mongoose.connection.close(); // Close the connection after insertion
  })
  .catch((err) => {
    console.error("Data insertion failed: ", err);
  });

// Define the GraphQL resolver
// const RootQuery = new GraphQLObjectType({
//     name: 'Query',
//     fields: {
//       topSellingProducts: {
//         type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Sale))),
//         args: {
//           limit: { type: GraphQLNonNull(GraphQLInt) },
//         },
//         resolve: async (parent, { limit }) => {
//           try {
//             // Fetch top-selling products from MongoDB
//             const topSellingProducts = await SalesData.find()
//               .sort({ order: -1 }) // Sort in descending order based on salesCount
//               .limit(limit); // Limit the result to the requested number of products

//             return topSellingProducts;
//           } catch (error) {
//             throw new Error('Failed to fetch top-selling products from the database.');
//           }
//         },
//       },
//     },
//   });

// Create and export the GraphQL schema
//module.exports = new GraphQLSchema({ query: RootQuery });

module.exports = SalesData;
