const { Thought } = require('../models');

const resolvers = {
  Query: {
    me: async () => {

    },
  },

  Mutation: {
    addUser: async (parent, {username, email, password }) => {

    },
    login: async (parent, { email, password }) => {
      
    },
    removeBook: async (parent, { thoughtId }) => {

    },
    saveBook: async (parent, { thoughtId, commentId }) => {
      
    },
  },
};

module.exports = resolvers;
