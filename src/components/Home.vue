<template>
  <v-container text-xs-center  class="home">
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary2"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <h2 style="color: white">Home Page</h2>
    <v-flex xs12>
      <!-- hide-delimiters -->
      <v-carousel v-if="!loading && posts.length > 0"
                  v-bind="{ 'cycyle': true }" interval="3000"
                  >
        <!-- Nicky you need to cut down the array to limit images in carousel -->
        <v-carousel-item v-for="post in posts"  
                        :key="post._id" :src="post.imageUrl"
                        @click.native="goToPost(post._id)">
          <h1 class="caro-title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
// import { gql } from 'apollo-boost';
// import gql from 'graphql-tag';
import {mapGetters} from 'vuex';

export default {
  name: 'home',
  data() {
    return {
      
    }
  },
  created() {
    this.handleGetCarouselPosts();
  },
  computed: {
    ...mapGetters(['loading', 'posts'])

    // posts() {
    //   return this.$store.getters.posts;
    // },
    // loading() {
    //   return this.$store.getters.loading;
    // }
  },
  methods: {
    handleGetCarouselPosts() {
      //reach out to Vuex store, fire action that gets posts for carousel
      this.$store.dispatch("getPosts");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
}

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
