const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');

const MONGODB_URI = 'mongodb://localhost:27017';
mongoose.connect(MONGODB_URI, {
  dbName: 'sales_DB',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Replace 'YOUR_PORT' with the desired port number, e.g., 3000
const PORT = process.env.PORT || '5000';

app.use('/graphql', graphqlHTTP({
  schema, // GraphQL schema here
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
