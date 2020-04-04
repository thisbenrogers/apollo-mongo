const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');


dotEnv.config();

const app = express();

app.use(cors());

// body parser middleware
app.use(express.json());

const typeDefs = gql`
  type Query {
    greetings: String!
  }
`;

const resolvers = {
  Query: {
    greetings: () => "Hello"
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

apolloServer.applyMiddleware({app, path: '/graphql' })

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
  res.send({ message: 'Hello there' });
})

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Ednpoint: ${apolloServer.graphqlPath}`);
});