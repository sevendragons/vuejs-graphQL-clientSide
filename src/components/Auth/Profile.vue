<template>
  <v-container class="text-xs-center">

    <!-- User Details Card -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined {{formatJoinDate(user.joinDate)}}</div>
                <div class="hidden-xs-only font-weight-thin"><strong>{{user.favorites.length}} </strong>   Favorites</div>
                <div class="hidden-xs-only font-weight-thin"><strong>{{userPosts.length}} </strong> Posts Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts Favorited by User -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no favorites currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Favorited
          <span class="font-weight-regular">({{userFavorites.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img @click="goToPost(favorite._id)" height="40vh" :src="favorite.imageUrl"></v-img>
            <v-card-text><strong>{{favorite.title}}</strong></v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Posts Created By user -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no posts currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Your Posts
          <span class="font-weight-regular">({{userPosts.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn @click="loadPost(post)" color="info" floating fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="loadDelete()" color="error" floating fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>

            <!-- dialog delete post -->
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleDeleteUserPost(post)">
              <v-layout row justify-center>
                <v-dialog v-model="deletePost" persistent max-width="290">
                  <v-card>
                    <v-card-title class="headline">Are you sure 🤫 😕 ⛩?</v-card-title>
                    <v-card-text>To delete this boring post, and even you dont what is it 🏎 🏈 ⚽️.</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" flat @click="deletePost = false">Disagree</v-btn>
                      <v-btn color="green darken-1" v-model="deleteAgree" flat type="submit">Agree</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>
            </v-form>  
            <!-- end -->

            <v-img @click="goToPost(post._id)" height="40vh" :src="post.imageUrl"></v-img>
            <v-card-text><strong>{{post.title}}</strong></v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit Post Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline primary2 lighten-2">Update Post  
          <v-icon large @click="editPostDialog = false" class="cancel" color="primary3">cancel</v-icon>
        </v-card-title>
        <v-container>
          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleUpdateUserPost">

            <!-- Title Input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="titleRules" v-model="title" label="Post Title" type="text" required></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Url Input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="imageRules" v-model="imageUrl" label="Image URL" type="text" required></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Preview -->
            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px">
              </v-flex>
            </v-layout>

            <!-- Categories Select -->
            <v-layout row>
              <v-flex xs12>
                <v-select v-model="categories" :rules="categoriesRules" :items="['Art', 'Education', 'Food', 'Furniture', 'Travel', 'Photography', 'Technology']" multiple label="Categories"></v-select>
              </v-flex>
            </v-layout>

            <!-- Description Text Area -->
            <v-layout row>
              <v-flex xs12>
                <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!isFormValid" type="submit" class="success--text" flat>
                <v-icon>system_update</v-icon>
                Update</v-btn>
              <v-btn class="error--text" flat @click="editPostDialog = false">
                <v-icon>cancel</v-icon>
                Cancel</v-btn>
            </v-card-actions>

          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    name: "Profile",
    data() {
      return {
        editPostDialog: false,
        deletePost: false,
        deleteAgree: false,
        isFormValid: true,
        title: "",
        imageUrl: "",
        categories: [],
        description: "",
        titleRules: [
          title => !!title || "Title Profile is Required 🤗 ✍️",
          title => title.length < 20 || "Title must has less than 20 characters 👌 ✌️"
        ],
        imageRules: [image => !!image || "Image is required" ],
        categoriesRules: [
          categories => categories.length >=1 || "At least 1 categories is choosen 👐 🙌"
        ],
        descRules: [
          desc => !!desc || "Description is required 👏 🤝",
          desc => 
            desc.length < 200 || "Description must have less than 200 characters 🤛 🖖"
        ]
      };
    },
    computed: {
      ...mapGetters(["user", "userFavorites", "userPosts"])
    },
    created() {
      this.handleGetUserPosts();
    },
    methods: {
      goToPost(id) {
        this.$router.push(`/posts/${id}`);
      },
      formatJoinDate(date) {
        return moment(new Date(date)).format('ll');
      },
      handleGetUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        });
      },
      handleUpdateUserPost() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch("updateUserPost", {
            postId: this.postId,
            userId: this.user._id,
            title: this.title,
            imageUrl: this.imageUrl,
            categories: this.categories,
            description: this.description
          });
          this.editPostDialog = false
        }
      },
      handleDeleteUserPost(post, deletePost = true) {
        this.loadPost(post, false);
        // const deletePost = window.confirm(
        //   "Are you sure you want to delete this post? 👌 😒"
        // );
        // let deleteAgree = true;
        if (deletePost) {
          this.$store.dispatch("deleteUserPost", {
            postId: this.postId
          })
        }
      },
      loadDelete(deletePost = true) {
        this.deletePost = deletePost;
      },
      loadPost(
        {_id, title, imageUrl, categories, description},
        editPostDialog = true
      ) {
        this.editPostDialog = editPostDialog;
        this.postId = _id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.categories = categories;
        this.description = description;
        
      }
    }
    
  }
</script>

<style scoped>
  h2, .headline {
    color: whitesmoke;
    margin-top: 16px  
  }
   .cancel{
    z-index: 999;
    background-color: white;
    border-radius: 100%; 
    position: absolute;
    right: 12px;
    top: 12px
  }
</style>
