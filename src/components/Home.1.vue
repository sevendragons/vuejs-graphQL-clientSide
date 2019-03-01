<template>
  <v-container class="home" v-if="getPosts">
    <h2>Home Page</h2>
    <!-- <div v-if="$apollo.loading"><h3>Loading ... 🤙</h3></div>
    <ul v-else v-for="post in getPosts" :key="post._id">
      <li>title: {{post.title}}</li>
      <li>description: {{post.description}}</li>
      <li>likes: {{post.likes}}</li>
    </ul>
    <figure><img src={post.imageUrl} alt=""></figure> -->
    <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{ result: {loading, data, error, networkStatus} }">
        <div v-if="loading">Loading ... 👊</div>
        <h3 v-else-if="error">Error! 😵 {{error.message}} 😵</h3>
        <p v-else-if="networkStatus">NetWork Status! 🛰 ⛩: <strong>{{networkStatus}} </strong></p>
        <ul v-else v-for="post in data.getPosts" :key="post._id">
          <li>title: {{post.title}}</li>
          <li>description: {{post.description}}</li>
          <li>likes: {{post.likes}}</li>
        </ul>
      </template>
    </ApolloQuery>

    <v-flex xs12>
      <v-carousel v-bind="{ 'cycyle': true }" interval="3000">
        <v-carousel-item v-for="post in getPosts" :key="post._id" :src="post.imageUrl">
          <h1 class="caro-title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>

  </v-container>
</template>

<script>
import { gql } from 'apollo-boost';
// import gql from 'graphql-tag'

export default {
  name: 'home',
  data() {
    return {
      post:[],  //when gql outside data
      getPostsQuery: gql`
        query {
          getPosts{
            title
            description
            imageUrl
            likes
            createdBy{
              _id
              username
              email
              password
              joinDate
            }
          }
        }
      `
    }
  },
  // apollo: {
  //   getPosts: {
  //     query: gql`
  //       query {
  //         getPosts{
  //           title
  //           description
  //           imageUrl
  //           likes
  //           createdBy{
  //             _id
  //             username
  //             email
  //             password
  //             joinDate
  //           }
  //         }
  //       }
  //     `,
  //     result({ data, loading, networkStatus }) {
  //       if (!loading) {
  //         this.posts = data.getPosts;
  //         console.log('[networkStatus]', networkStatus );
          
  //       }
  //     },
  //     error(err) {
  //       console.error('[ERROR 🙀 👻 !!]', err);
  //       console.dir(err)
        
  //     }
  //   }
  // }
}

// result(arg){
//   console.dir(arg)
//   console.log(arg)
// },
// error(err) {
//   console.error('[ERROR!!]', err);
//   console.dir(err)
  
// }
</script>

<style lang="css">
  h2{
    margin-top: 54px; 
  }

</style>

<style lang="css" scoped>
  .caro-title{
    position: absolute;
    background-color: rgba(0, 0, 0, .5);
    color: white;
    border-radius: 5px 5px 0 0;
    padding: .5em;
    margin: 0 auto;
    bottom: 50px;
    left: 0;
    right: 0
  }
</style>