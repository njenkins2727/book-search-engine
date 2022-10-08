import { gql } from '@apollo/client';

export const GET_ME = gql`
  query user($username: String!) {
    user(username: $username) {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
      }
    }
  }
`;
