const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = require("graphql");
const Sale = require("../models/sale");
const mongoose = require("mongoose");

// Replace "your_mongodb_connection_string" with the actual connection string of your MongoDB database
// mongoose.connect("mongodb://localhost:27017", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB!");
// });

const SaleType = new GraphQLObjectType({
  name: "Sale",
  fields: () => ({
    id: { type: GraphQLString },
    product: { type: GraphQLString },
    salesRevenue: { type: GraphQLInt },
    region: { type: GraphQLString },
    order: { type: GraphQLInt },
    date: { type: GraphQLString },
    price: { type: GraphQLString },
    category: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    sale: {
      type: SaleType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Sale.findById(args.id);
      },
    },
    topSellingProducts: {
      type: SaleType,
      args: {
        limit: { type: GraphQLInt },
      },
      resolve: async (parent, { limit }) => {
        try {
          // Fetch top-selling products from MongoDB
          const topSellingProducts = await Sale.find()
            .sort({ order: -1 }) // Sort in descending order based on salesCount
            .limit(limit); // Limit the result to the requested number of products

          return topSellingProducts;
        } catch (error) {
          console.warn("eeeee", error);
          throw new Error(
            "Failed to fetch top-selling products from the database."
          );
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addSalesData: {
      type: SaleType,
      args: {
        product: { type: GraphQLString },
        salesRevenue: { type: GraphQLInt },
        region: { type: GraphQLString },
        order: { type: GraphQLInt },
        date: { type: GraphQLString },
        price: { type: GraphQLString },
        category: { type: GraphQLString },
      },
      resolve(parent, args) {
        const sale = new Sale({
          product: args.product,
          salesRevenue: args.salesRevenue,
          region: args.region,
          order: args.order,
          date: args.date,
          price: args.price,
          category: args.category,
        });
        return sale.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
