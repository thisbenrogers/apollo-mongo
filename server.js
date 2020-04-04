const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const uuid = require('uuid');

const { tasks, users } = require('./constants');


dotEnv.config();

const app = express();

app.use(cors());

// body parser middleware
app.use(express.json());

const typeDefs = gql`
  type Query {
    greetings: String!
    tasks: [Task!]
    task(id: ID!): Task
    users: [User!]
    user(id: ID!): User
  }

  input createTaskInput {
    name: String!
    completed: Boolean!
    userId: ID!
  }

  type Mutation {
    createTask(input: createTaskInput!): Task
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  }
`;

const resolvers = {
  // Query-level resolver
  Query: {
    greetings: () => "Hello",
    tasks: () => tasks,
    task: (_, args) => tasks.find(task => task.id === args.id) ,
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
  },
  Mutation: {
    createTask: (_, { input }) => {
      const task = { ...input, id: uuid.v4() };
      tasks.push(task);
      return task;
    }
  },
  // Field-Level resolver:
  Task: {
    user: ({ userId }) => users.find(user => user.id === userId)
  },
  User: {
    tasks: ({ id }) => tasks.filter(task => task.userId === id)
  },
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