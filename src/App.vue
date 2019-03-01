<template>
  <v-app>
    <!-- Side navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar dark flat color="secondary2">
        <v-toolbar-side-icon @click="toogleSideNav"></v-toolbar-side-icon>  
          <router-link to="/" tag="span" style="cursor: pointer">
            <h1 class="title pl-3">VueShare</h1>
          </router-link>
      </v-toolbar>
      <v-divider></v-divider>
      <!-- Side Navbar Links -->
      <v-list>
        <v-list-tile v-for="item in sideItems" :key="item.title"
                     :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>  
          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>

        <!-- Sign out Button -->
        <v-list-tile v-if="user" @click="handleSignOut">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Sign Out ☝️</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal navbar -->
    <v-toolbar fixed color="primary" dark>
      <v-toolbar-side-icon @click="toogleSideNav"></v-toolbar-side-icon>  
      <v-toolbar-title class="hiden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          VueShare
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Search Input -->
      <v-text-field flex prepend-icon="search"
                    v-model="searchTerm"
                    @input="handleSearchPosts" 
                    placeholder="Search posts" 
                    color="success2" single-line 
                    hide-details></v-text-field> 

      <!-- Search Results Card -->
      <v-card dark v-if="searchResults.length" id="search__card">
        <v-list color="primary3">
          <v-list-tile v-for="result in searchResults"
                       :key="result._id"
                       @click="goToSearchResult(result._id)">
            <v-list-tile-title>
              <strong class="sTitle" style="color:#91cbf9">Title</strong>: {{result.title}}  <span style="padding-left: 12px">🛰  🚀</span> 
              <span class="sDesc font-weight-thin"><strong style="color: #91cbf9">Description:</strong> {{formatDescription(result.description) }}</span>
            </v-list-tile-title>

            <!-- Show Icon if Result Favorite by User, means you like -->
            <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
              <v-icon class="animated pulse infinite delay-2s" color="warning">favorite</v-icon>
            </v-list-tile-action>

             <v-list-tile-action>
              <v-btn icon ripple @click="clearSearch">
                <v-icon class="clearSearch" color="success2 lighten-1" absolute>cancel</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

      </v-card>
      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in horizontalItems"
               :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <!-- Profile Button -->
        <v-btn flat to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account-box</v-icon>
          <v-badge right color="warning darken-2" :class="{'bounce animated': badgeAnimated}">

            <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
            Profile
          </v-badge>
        </v-btn>

        <!-- Signout Button -->
        <v-btn flat v-if="user" @click="handleSignOut">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          SignOut 👈
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>   

    <!-- App content  -->
    <main class="post">
      <v-container class="mt-4">
        <transition name="fade">
          <router-view ></router-view>
        </transition>

        <!-- Auth Error Snackbar -->
        <v-snackbar
          color="error" bottom left
          v-if="authError"
          v-model="authErrorSnackbar"
          :timeout='5000'
          style="height: auto">
          <v-icon class="mr-3" style="cursor: pointer">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark flat to="/signIn">Sign In 🖖</v-btn>
        </v-snackbar>

        <!-- Auth Snackbar -->
        <v-snackbar
          color="success" bottom left
          v-model="authSnackbar"
          :timeout='7000'>
          <v-icon class="mr-3" style="cursor: pointer">check_circle</v-icon>
          <h3>You are now Signed In! 🤙</h3>
          <v-btn dark flat @click.native="authSnackbar = false">Close 👊</v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'App',
    data() {
      return{
        sideNav: false,
        authSnackbar: false,
        authErrorSnackbar: false,
        badgeAnimated: false,
        searchTerm: ""
      }
    },
    watch: {
      user(newValue, oldValue) {
        // if we had no value previouly for the user, we will show the snackbar
        console.log('new value', newValue);
        console.log('old value', oldValue);
        if(oldValue === null){
          this.authSnackbar = true
        }
      },
      authError(value) {
        // if auth error is not null, show auth error snackbar
        if (value !== null) {
            this.authErrorSnackbar = true
        }
      },
      userFavorites(value) {
        // if user favorites value changed at all
        if (value) {
          this.badgeAnimated = true;
          setTimeout( () => (this.badgeAnimated = false), 1000 );
        }
      }
    },
    computed: {
      ...mapGetters(['error', 'user', 'authError', 'userFavorites', 'searchResults']),

      horizontalItems() {
        let items = [
          { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'lock_open', title: 'Sign In', link: '/signIn' },
          { icon: 'create', title: 'Sign Up', link: '/signUp' },
        ];
        if (this.user) {
          items =  [
            { icon: 'chat', title: 'Posts', link: '/posts' }
          ]
        }
        return items;
      },
      sideItems() {
        let items = [
          { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'lock_open', title: 'Sign In', link: '/signIn' },
          { icon: 'create', title: 'Sign Up', link: '/signUp' },
        ];
        if (this.user) {
          items = [
            { icon: 'chat', title: 'Posts', link: '/posts' },
            { icon: 'stars', title: 'Create Posts', link: '/post/addPost' },
            { icon: 'account_box', title: 'Profile', link: '/profile' }
          ]
        }
        return items;
      }
    },
    methods: {
      toogleSideNav() {
        this.sideNav = !this.sideNav;
      },
      handleSignOut() {
        this.$store.dispatch('signoutUser')
      },
      handleSearchPosts() {
        this.$store.dispatch('searchPosts', {
          searchTerm: this.searchTerm
        });
      },
      checkIfUserFavorite(resultId) {
        return (
          this.userFavorites &&
          this.userFavorites.some(fave => fave._id === resultId)
        );
      },
      // truncate description
      formatDescription(desc) {
        return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
      },
      goToSearchResult(resultId) {
        // Clear search term
        this.searchTerm = '';
        // Go to desired result
        this.$router.push(`/posts/${resultId}`);
        // Clear search result
        this.$store.commit ('clearSearchResults');

      },
      clearSearch() {
        this.searchTerm = null;
        this.$store.commit ('clearSearchResults');
      }
    },
    components: {
      
    }
  }
</script>

<style lang="css">
  .fade-enter-active, .fade-leave-active{
    transition-property: all;
    transition-duration: .3s;
  }
  .fade-enter-active{
    transition-delay: .3s;
  }
  .fade-enter, .fade-leave-active{
    opacity: 0;
    transform: translateX(-25px);
  }
  .post{
    height: auto;
    background: linear-gradient(221deg, #199ab4, #e7310d, #6e0de7);
    background-size: 600% 600%;

    -webkit-animation: CustomAnimation 10s ease infinite;
    -moz-animation: CustomAnimation 10s ease infinite;
    animation: CustomAnimation 10s ease infinite;
  }
    @keyframes CustomAnimation {
        0%{background-position:77% 0%}
        50%{background-position:24% 100%}
        100%{background-position:77% 0%}
    }
    @-webkit-keyframes CustomAnimation {
        0%{background-position:77% 0%}
        50%{background-position:24% 100%}
        100%{background-position:77% 0%}
    }
    @-moz-keyframes CustomAnimation {
        0%{background-position:77% 0%}
        50%{background-position:24% 100%}
        100%{background-position:77% 0%}
    }
    @keyframes CustomAnimation { 
        0%{background-position:77% 0%}
        50%{background-position:24% 100%}
        100%{background-position:77% 0%}
    }

    /* User Favorite Animatioon */
    /* .bounce {
      -webkit-animation-name: bounce;
      animation-name: bounce;
      -webkit-transform-origin: center bottom;
      transform-origin: center bottom;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
    }
    @keyframes bounce {
      from,20%,53%,80%,to {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      } 

      40%,43% {
        -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        -webkit-transform: translate3d(0, -30px, 0);
        transform: translate3d(0, -30px, 0);
      }

      70% {
        -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        -webkit-transform: translate3d(0, -15px, 0);
        transform: translate3d(0, -15px, 0);
      }

      90% {
        -webkit-transform: translate3d(0, -4px, 0);
        transform: translate3d(0, -4px, 0);
      }   
    } */



</style>
<style lang="css" scoped>
  #search__card {
    position: absolute;
    width: 100vw;
    z-index: 8;
    top: 100%;
    left: 0%;
  }
  .v-list__tile {
    z-index: 8;
    padding: 16px 32px 21px 32px;
  }
  .sDesc{
    padding-left: 12px;
  }
</style>