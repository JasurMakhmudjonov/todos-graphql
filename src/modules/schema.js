
const typeDefs = `#graphql

  type User {
    id: ID!
    fullname: String!
    email: String!
    password: String!
    todos: [Todo!]!
  }

  type Todo {
    id: ID!
    title: String!
    description: String!
    user: User!
  }

  type Query {
    getUsers: [User]!
    getUser(id: ID!): User
    getTodos(user_id: String!): [Todo]!
    getTodo(id: ID!): Todo
  }

  type Mutation {
    addUser(fullname: String!, email: String!, password: String!): User
    updateUser(id: ID!, fullname: String!, email: String!, password: String!): User
    deleteUser(id: ID!): User
    addTodo(title: String!, description: String!, user_id: String!): Todo
    updateTodo(id: ID!, title: String!, description: String!, user_id: String!): Todo
    deleteTodo(id: ID!): Todo
  }
`;

module.exports = typeDefs;
