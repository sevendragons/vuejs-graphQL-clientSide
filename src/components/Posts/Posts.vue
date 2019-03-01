<template>
  <v-container fluid grid-list-xl>

    <!-- Post cards -->
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover>
          <v-img :src="post.imageUrl"
                 height="39vh" lazy
                 @click.native="goToPost(post._id)"></v-img>
            <v-card-actions>
              <v-card-title primary @click="goToPost(post._id)">
                <div>
                  <div class="headline">{{post.title}}</div>
                  <div>
                    <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
                    <v-icon style="margin: 0 6px -4px 16px" color="black">more</v-icon>
                    <span>Detail</span>
                  </div>
                </div>
              </v-card-title>
              <v-spacer></v-spacer>
              <v-btn @click="showPostCreator = !showPostCreator" icon>
                <v-icon>{{ `keyboard_arrow_${showPostCreator ? 'up' : 'down'}` }}</v-icon>
              </v-btn>
            </v-card-actions>

            <!-- Post Creator Tile -->
            <v-slide-y-transition>
              <v-card-text v-show="showPostCreator" class="grey lighten-4">
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                    <img :src="post.createdBy.avatar" alt="">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title class="text--primary">{{post.createdBy.username}}</v-list-tile-title>
                    <v-list-tile-sub-title class="font-weight-thin">Added ⏰: {{ formatCreatedDate(post.createdDate) }}</v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn icon ripple>
                      <v-icon color="grey lighten-1">info</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-card-text>
            </v-slide-y-transition>
        
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout v-if="showMoreEnabled" column>
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn @click="showMorePosts" dark color="secondary2">Fetch More 😉</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <router-link to="post/addPost">
        <v-btn fab dark color="indigo" class="addPost">
          <v-icon dark>add</v-icon>
        </v-btn>
    </router-link>

  </v-container>
</template>

<script>
  import moment from 'moment';
  import {INFINITE_SCROLL_POSTS} from '../../queries';

  const pageSize = 4;

  export default {
    name: 'Posts',
    data() {
      return {
        pageNum: 1,
        // showMoreEnabled: true,
        showPostCreator: false
      }
    },
    apollo: {
      infiniteScrollPosts: {
        query: INFINITE_SCROLL_POSTS,
        variables: {
          pageNum: 1,
          pageSize
        }
      }
    },
    methods: {
      goToPost(postId) {
        this.$router.push(`/posts/${postId}`);
      },
      formatCreatedDate(date) {
        return moment(new Date(date)).format("ll")
      },

      showMorePosts() {
        // fetch more data and transform the original result
        this.pageNum += 1;
        this.$apollo.queries.infiniteScrollPosts.fetchMore({
          variables: {
            // pageNum incremented by 1
            pageNum: this.pageNum,
            pageSize
          },
          updateQuery: ( prevResult, { fetchMoreResult }) => {
            console.log("previous result", prevResult.infiniteScrollPosts.posts);
            console.log("fetch more result", fetchMoreResult);

            const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
            const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
            // this.showMoreEnabled = hasMore;

            return {
              infiniteScrollPosts: {
                __typename: prevResult.infiniteScrollPosts.__typename,
                // Merge previous posts with new posts
                posts: [
                  ...prevResult.infiniteScrollPosts.posts,
                  ...newPosts
                ],
                hasMore
              }
            }
          }
        });
      }
    }, 
    computed: {
      showMoreEnabled() {
        return this.infiniteScrollPosts && this.infiniteScrollPosts.hasMore
      }
    } 

  }
  
</script>

<style scoped>
  .addPost{
    position: absolute;
    right: 16px;
    bottom: 8px;
  }
</style>
