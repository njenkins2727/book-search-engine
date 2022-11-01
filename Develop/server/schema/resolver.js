const { Error } = require('mongoose');
const { AuthenticationError } = require('../error/AuthenticationError');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

function checkIfLoggedIn (context){
  if(!context.user){
    throw new AuthenticationError('Not logged in')
  }
}

const resolvers = {
  Query: {
    me: async () => {
      if (context.user) { // context.user -- if user is validated and logged in 
        checkIfLoggedIn(context)
        const userData = await User.findOne({ _id: context.user._id}).select('-_v -password');

        return userData;
      }

    },
  },

  Mutation: {
    addUser: async (parent, {username, email, password }, context ) => {
      const user = await User.create({
        username, email, password
      });

      if (!user){
        throw new Error('Something went wrong')
      }
      const token = signToken(user);
      return (token, user)
    },
    login: async (parent, { email, password }) => {
    const user = await User.findOne({email: email});
      if (!user) {
        throw new Error('User or Password is incorrect');
      }

    const correctPw = await user.isCorrectPassword(password); // in user model isCorrectPAssword 
      if (!correctPw) {
        throw new Error('User or Password is incorrect')
      }

    const token = signToken(user);
    return ({ token, user }); //if you look in type def we are returning an Auth object, here is that auth object, token and user 
    },

    removeBook: async (parent, { bookId }, context) => {
      checkIfLoggedIn(context)
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error('Could not find user with this id!')
      }
      return updatedUser;
    },

    saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
      checkIfLoggedIn(context)
      
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id } ,
        { $addToSet: { savedBooks: {
          bookId, authors, description, title, image, link
        } } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;