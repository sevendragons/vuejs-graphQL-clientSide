import { gql } from 'apollo-boost';

//🌟🌟-------------- Posts with 's' Queries --------------🌟🌟//
export const GET_POSTS = gql `
  query {
    getPosts {
      _id
      title
      imageUrl
      createdBy{
        _id
        username
        email
        password
        joinDate
      }
    }
  }
`;

//🌟🌟--------- Single Post Query get ---------🌟🌟//
export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      messages
      {
        _id
        messageBody
        messageDate
        messageUser {
          _id
          username
          avatar
        }
      }
    }
  }
`;

//🌟🌟-------------- User Queries --------------🌟🌟 
export const GET_CURRENT_USER = gql`
  query{
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      joinDate
      favorites{
        _id
        title
        imageUrl
      }
    }
  }
`;

//🌟🌟--------- This is for User Profile ---------🌟🌟//
export const GET_USER_POSTS = gql`
  query($userId: ID!) {
    getUserPosts(userId: $userId) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
      likes
    }
  }  
`;

//🌟🌟--------- Infinite_Scroll_Posts ---------🌟🌟//
export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!){
    infiniteScrollPosts( pageNum: $pageNum, pageSize: $pageSize ) {
      hasMore
      posts {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages{
          _id
        }
        createdBy{
          _id
          username
          avatar
        }
      }

    }
  } 
`;

export const SEARCH_POSTS = gql`
  query($searchTerm: String) {
    searchPosts(searchTerm: $searchTerm){
      _id
      title
      description
      imageUrl
      likes
    }
  }
`


// 🌟 --------------------------------------------------------------🌟 //
// 🌟 MUTATION
// 🌟--------------------------------------------------------------🌟 //
// 🌟🌟-------------- Posts Mutations --------------🌟🌟/
export const ADD_POST = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
    $creatorId: ID!
  ) {
    addPost(
      title: $title,
      imageUrl: $imageUrl,
      categories: $categories,
      description: $description,
      creatorId: $creatorId
    ) {
      _id
      title
      imageUrl
      categories
      description
    }
  }
`;

//🌟🌟--------- Like User Post ---------🌟🌟//
export const LIKE_POST = gql `
  mutation($postId: ID!, $username: String!) {
    likePost(postId: $postId, username: $username) {
      likes
      favorites{
        _id
        title
        imageUrl
      }
    }
 }
`;
//🌟🌟--------- UnLike User Post ---------🌟🌟//
export const UNLIKE_POST = gql `
  mutation($postId: ID!, $username: String!) {
    unlikePost(postId: $postId, username: $username) {
      likes
      favorites{
         _id
         title
         imageUrl
      }
    }
  }
`;

//🌟🌟--------- Update User Profile Post ---------🌟🌟//
export const UPDATE_USER_POST = gql `
  mutation(
    $postId: ID!
    $userId: ID!
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
  ) {
    updateUserPost(
      postId: $postId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
    ) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
      likes
      createdBy{
        _id
        avatar
      }
    }
  }
`;

//🌟🌟--------- Delete User Post ---------🌟🌟//
export const DELETE_USER_POST = gql `
  mutation($postId: ID!) {
    deleteUserPost(postId: $postId) {
      _id
    }
  }
`;

//🌟🌟--------- Delete Message Post 🌟 this is new from Nicky 🌟 ---------🌟🌟//
export const DELETE_MESSAGE_POST = gql `
  mutation($messageId: ID!) {
    deleteMessagePost(messageId: $messageId) {
      _id
    }
  }
`;

//🌟🌟--------- Add Post Messages ---------🌟🌟//
export const ADD_POST_MESSAGE = gql `
  mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
    addPostMessage(
      messageBody: $messageBody, 
      userId: $userId, 
      postId: $postId
    ) {
      _id
      messageBody
      messageDate
      messageUser{
        _id
        username
        avatar
      }
    }
  }
`;

//🌟🌟-------------- User Mutations --------------🌟🌟/
export const SIGNIN_USER = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: $email, password: $password) {
     token 
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser( username: $username,
                email: $email,
                password: $password
    ) { 
      token
    }
  }`;