<template>
  <v-container v-if="getPost" flexbox center> 
    <!-- Post Card --> 
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn large icon color="info2" dark 
                   v-if="user"
                   @click="handleToggleLike">
              <v-icon large 
                      :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'"
                      >favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="primary3" large>arrow_back</v-icon>
          </v-card-title>

          <v-tooltip bottom>
            <span>Click to enlarge or bigger image 😤</span>
            <v-img @click="toggleImageDialog"
                          slot="activator" :src="getPost.imageUrl" id="post__image"></v-img>
          </v-tooltip>

          <!-- Enlarged Post Image or make it bigger -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img @click="dialog=false"
                            :src="getPost.imageUrl" height="80vh">
                <v-icon @click="dialog=false" large color="primary3" absolute class="cancel">cancel</v-icon>
              </v-img>
            </v-card>
          </v-dialog>
          
          <v-card-text>
            <v-layout row wrap align-center>
              <h2 style="margin:0 12px 12px 4px">Categories:</h2>
              <span v-for="(category, index) in getPost.categories" :key="index">
                  <v-chip class="mb-3" color="#e91e63" text-color="white"> {{category}}</v-chip>
              </span>
            </v-layout>
            <v-layout row align-center fill-height>
              <h2 style="margin:0 12px 0 4px">Description:</h2>
              <h3> {{getPost.description}}</h3>
            </v-layout>
          </v-card-text>
        </v-card>	
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3" v-if="user">
    <!-- Message Input -->
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <!-- <h2>Test</h2> -->
          <v-form @submit.prevent="handleAddPostMessage"
                  v-model="isFormValid"
                  lazy-validation
                  ref="form">
            <v-layout row>
              <v-flex xs12>
                <v-text-field clearable v-model="messageBody"     
                              :append-outer-icon="messageBody && 'send'"
                              label="Add Message" type="text" 
                              @click:append-outer="handleAddPostMessage"
                              prepend-icon="email" required
                              :rules="messageRules"
                              style="background: white; padding: 18px 12px">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      
      <v-tooltip bottom>
        <span><strong style="color:blue">Blue</strong>, it means you comment 🛩 🛫</span>
        <v-layout row wrap slot="activator">
          <v-flex xs12>
            <v-list subheader two-line>
              <v-subheader>Messages ({{ getPost.messages.length}})</v-subheader>
              <template  v-for="message in getPost.messages">
                <v-divider :key="message._id"></v-divider>
                <v-list-tile avatar inset :key="message.title">
                  <v-list-tile-avatar>
                    <img :src="message.messageUser.avatar" :alt="message.title">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{message.messageBody}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{message.messageUser.username}}
                      <span class="grey--text text--lighten-1 hidden-xs-only">
                        {{ formatCreatedDate(message.messageDate) }}
                      </span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action class="hidden-xs-only">
                    <v-layout row wrap>
                      <v-icon style="margin-right:12px" :color="checkIfOwnMessage(message) ? 'primary3' : 'grey'">chat_bubble</v-icon>
                      <v-icon color="error" absolute class="cancel1">cancel</v-icon>
                    </v-layout>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
        </v-layout>
      </v-tooltip>
    </div>

  </v-container>
</template>

<script>
  import { GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST } from '../../queries'
  import { mapGetters } from 'vuex'
  import moment from 'moment';


  export default {
    name: 'Post',
    props: ['postId'],
    data() {
      return {
        postLiked: false,
        dialog: false,
        messageBody: '',
        isFormValid: true,
        messageRules: [
          message => !!message || 'Message is requires please !!! 🤫 🤥 🤓',
          message => message.length < 50 || 'Message must be less than 50 characters 🛩 🛫 🛬'
        ]
      }
    },
    apollo: {
      getPost: {
        query: GET_POST,
        variables() {
          return {
            postId: this.postId
          }
        }
      }
    },
    computed: {
      ...mapGetters(['user', 'loading', 'userFavorites'])
    },
    methods: {
      goToPreviousPage() {
        this.$router.go(-1);
      },
      toggleImageDialog() {
        if ( window.innerWidth > 500) {
          this.dialog = !this.dialog
        }
      },
      formatCreatedDate(date) {
        return moment(new Date(date)).fromNow()
      },
      checkIfPostLiked(postId) {
        //check if user favorites include post with id of 'postId'
        if ( this.userFavorites && 
             this.userFavorites.some(fave => fave._id === postId )
            ) {
          this.postLiked = true;
          return true;
        } else {
          this.postLiked = false;
          return false;
        }
      },
      handleToggleLike() {
        if (this.postLiked) {
          this.handleUnlikePost();
        } else {
          this.handleLikePost();
        }
      },
      checkIfOwnMessage(message){
        return this.user && this.user._id === message.messageUser._id;
      },
      // handleDeletePostMessage() {
      //   this.$apollo.mutate({
      //     mutation: DELETE_MESSAGE_POST,
      //     variables
      //   })
      // },
      handleAddPostMessage() {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        }; 
        this.$apollo.mutate({
          mutation: ADD_POST_MESSAGE,
          variables,
          update: ( cache, {data: { addPostMessage }} ) => {
            const data = cache.readQuery({ 
              query: GET_POST,
              variables: { postId: this.postId } 
            });
            data.getPost.messages.unshift(addPostMessage);
            // console.log('data', data ) 
            // console.log('add post message', addPostMessage )
            cache.writeQuery({ 
              query: GET_POST,
              variables: { postId: this.postId },
              data 
            }); 
            this.messageBody = "";
          }
        }).then( ({ data }) =>{
          console.log(data.addPostMessage);
        }).catch(err => console.error(err) );
      },
      // handleDeletePostMessage(message) {
      //   this.loadMessage(message, false);
      //   const deleteMessage = window.confirm(
      //     "Are you sure you want to delete this message? 👌 😒"
      //   );
      //   if (deleteMessage) {
      //     this.$store.dispatch("deleteMessage", {
      //       messageId: messageId
      //     })
      //   }
      // },
      // loadMessgae(
      //   {_id, messageBody},
      //   editMessageDialog = true
      // ) {
      //   this.messageId = _id
      // },
      handleLikePost(){
        const variables =  {
          postId: this.postId,
          username: this.user.username
        };
        this.$apollo.mutate({
          mutation: LIKE_POST,
          variables,
          update: (cache, { data: {likePost} } ) => {
            const data = cache.readQuery ({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variable: {postId: this.postId},
              data
            })
          }
        })
        .then( ({ data }) => {
          const updateUser = {
            ...this.user,
            favorites: data.likePost.favorites
          };
          this.$store.commit("setUser", updateUser);
        })
        .catch(err => console.error(err))
      }, 
      handleUnlikePost(){
        const variables =  {
          postId: this.postId,
          username: this.user.username
        };
        this.$apollo.mutate({
          mutation: UNLIKE_POST,
          variables,
          update: (cache, { data: {unlikePost} } ) => {
            const data = cache.readQuery ({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST,
              variable: {postId: this.postId},
              data
            })
          }
        })
        .then( ({ data }) => {
          const updateUser = {
            ...this.user,
            favorites: data.unlikePost.favorites
          };
          this.$store.commit("setUser", updateUser);
        })
        .catch(err => console.error(err))
      } 
    }
  }
</script>

<style scoped>
  #post__image{
    height: 400px !important;
  }
  .cancel{
    z-index: 999;
    background-color: white;
    border-radius: 100%; 
    position: absolute;
    right: 4px;
    top: 4px
  }
</style>
