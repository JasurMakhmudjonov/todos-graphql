const { ApolloError } = require("@apollo/server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await prisma.users.findMany({
          include: {
            todos: true,
          },
        });
        return users;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
    getUser: async (_, { id }) => {
      try {
        const user = await prisma.users.findUnique({
          where: { id },
          include: {
            todos: true,
          },
        });
        if (!user) {
          throw new ApolloError("User not found", "NOT_FOUND");
        }
        return user;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
    getTodos: async (_, { user_id }) => {
      try {
        const todos = await prisma.todos.findMany({
          where: { user_id },
          include: {
            user: true,
          },
        });
        return todos;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
    getTodo: async (_, { id }) => {
      try {
        const todo = await prisma.todos.findUnique({
          where: { id },
          include: {
            user: true,
          },
        });
        if (!todo) {
          throw new ApolloError("Todo not found", "NOT_FOUND");
        }
        return todo;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
  },
  Mutation: {
    addUser: async (_, { fullname, email, password }) => {
      try {
        const existingUser = await prisma.users.findUnique({
          where: { email },
        });
        if (existingUser) {
          throw new ApolloError("User already exists", "BAD_USER_INPUT");
        }
        const newUser = await prisma.users.create({
          data: {
            fullname,
            email,
            password,
          },
          include: {
            todos: true,
          },
        });
        return newUser;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
    updateUser: async (_, { id, fullname, email, password }) => {
      try {
        const existingUser = await prisma.users.findUnique({ where: { id } });
        if (!existingUser) {
          throw new ApolloError("User not found", "NOT_FOUND");
        }
        const updatedUser = await prisma.users.update({
          where: { id },
          data: {
            fullname,
            email,
            password,
          },
          include: {
            todos: true,
          },
        });
        return updatedUser;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const existingUser = await prisma.users.findUnique({ where: { id } });
        if (!existingUser) {
          throw new ApolloError("User not found", "NOT_FOUND");
        }
        const deletedUser = await prisma.users.delete({ where: { id } });
        return deletedUser;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
    addTodo: async (_, { title, description, user_id }) => {
      try {
        const existingUser = await prisma.users.findUnique({
          where: { id: user_id },
        });
        if (!existingUser) {
          throw new ApolloError("User not found", "NOT_FOUND");
        }
        const existingTodo = await prisma.todos.findUnique({
          where: { title },
        });
        if (existingTodo) {
          throw new ApolloError("Todo already exists", "BAD_USER_INPUT");
        }
        const newTodo = await prisma.todos.create({
          data: {
            title,
            description,
            user: {
              connect: { id: user_id },
            },
          },
          include: {
            user: true,
          },
        });
        return newTodo;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
    updateTodo: async (_, { id, title, description, user_id }) => {
      try {
        const existingTodo = await prisma.todos.findUnique({ where: { id } });
        if (!existingTodo) {
          throw new ApolloError("Todo not found", "NOT_FOUND");
        }
        const updatedTodo = await prisma.todos.update({
          where: { id },
          data: {
            title,
            description,
            user: {
              connect: { id: user_id },
            },
          },
          include: {
            user: true,
          },
        });
        return updatedTodo;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
    deleteTodo: async (_, { id }) => {
      try {
        const existingTodo = await prisma.todos.findUnique({ where: { id } });
        if (!existingTodo) {
          throw new ApolloError("Todo not found", "NOT_FOUND");
        }
        const deletedTodo = await prisma.todos.delete({ where: { id } });
        return deletedTodo;
      } catch (error) {
        throw new ApolloError(error.message, "INTERNAL_SERVER_ERROR");
      }
    },
  },
};
