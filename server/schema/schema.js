const faker = require("faker");
const graphql = require("graphql");
const Order = require("../models/ecom.order");
const Product = require("../models/ecom.product");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between
//these object types and describes how it can reach into the graph to interact with
//the data to retrieve or mutate the data

const OrderType = new GraphQLObjectType({
  name: "Order",
  //We are wrapping fields in the function as we dont want to execute this ultil
  //everything is inilized. For example below code will throw error AuthorType not
  //found if not wrapped in a function
  fields: () => ({
    orderId: { type: GraphQLString },
    orderDate: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    revenue: { type: GraphQLInt },
    region: { type: GraphQLString },
    product: {
      type:  new GraphQLList(ProductType), 
      resolve(parent, args) {
        return Product.find({ productId: parent.productId });
      },
    },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    productId: { type: GraphQLString },
    price: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    name: { type: GraphQLString },
    category: { type: GraphQLString },
    order: {
      type: new GraphQLList(OrderType),
      resolve(parent, args) {
        return Order.find({ productId: parent.productId });
      },
    },
  }),
});

const TopSellingProductType = new GraphQLObjectType({
  name: "TopSellingProducts",
  fields: () => ({
    productId: { type: GraphQLString },
    price: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    name: { type: GraphQLString },
    category: { type: GraphQLString },
    order: {
      type: new GraphQLList(OrderType),
      resolve(parent, args) {
        return Order.find({ productId: parent.productId });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //get orders by productId
    order: {
      type: OrderType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Order.findById({ productId: parent.id });
      },
    },
    //get all order
    orders: {
      type: new GraphQLList(OrderType),
      resolve(parent, args) {
        return Order.find({}).sort({ quantity: 1 });
      },
    },
    //get productId by productId
    product: {
      type: ProductType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Product.findById({ productId: parent.id });
      },
    },
    //get all productID
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({});
      },
    },
    //advance
    //get top product
    topSellingProducts: {
      type: new GraphQLList(TopSellingProductType),
      resolve(parent, args) {
        return Product.find({});
      },
    },
  },
});

//for add/update to the database.
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        //GraphQLNonNull make these field required
        price: { type: new GraphQLNonNull(GraphQLInt) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let product = new Product({
          price: args.price,
          quantity: args.quantity,
          name: args.name,
          category: args.category,
          productId: "testProduct" + faker.random.number({ min: 1, max: 100 }),
        });
        return product.save();
      },
    },
    addOrder: {
      type: OrderType,
      args: {
        orderDate: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
        revenue: { type: new GraphQLNonNull(GraphQLInt) },
        productId: { type: new GraphQLNonNull(GraphQLString) },
        region: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let order = new Order({
          orderDate: args.orderDate,
          quantity: args.quantity,
          revenue: args.revenue,
          productId: args.productId,
          region: args.region,
          orderId: "testOrder" + faker.random.number({ min: 1, max: 100 }),
        });
        return order.save();
      },
    },
  },
});

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});