import Vue from 'vue'
import Vuex from 'vuex'
import router from './router/router';
// import {gql} from 'apollo-boost';

import {defaultClient as apolloClient} from './main'; 
import {
  GET_POSTS,
  GET_CURRENT_USER,
  SIGNIN_USER,
  SIGNUP_USER,
  ADD_POST,
  INFINITE_SCROLL_POSTS,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  DELETE_MESSAGE_POST,
} from './queries';
//This mean we rename from defaultClient to apolloClient

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null, 
    authError: null,
    searchResults: [],
    userPosts: []
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: ( state, payload ) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: ( state, payload ) => {
      state.loading = payload;
    },
    setError: ( state, payload ) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null ) {
        state.searchResults = payload
      }
    },

    clearUser: state => ( state.user = null ),
    clearError: state => ( state.error = null ),
    clearSearchResults: state => ( state.searchResults = [] )

  },

  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({data}) => {
        commit('setLoading', false);
        // Add user data to state
        commit("setUser", data.getCurrentUser);
        console.log(data.getCurrentUser);
      })
      .catch(err => {
        commit('setLoading', false);
        console.error(err);
        
      })
    },
    getPosts: ({commit}) => {
      //use ApolloClient to fire getPosts query
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_POSTS
        }).then( ( {data} ) => {
          //Get Data from the actions to state via muatations
          //Commit passed data from actions along to muatation functions
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
          // console.log( data.getPosts);
        })
        .catch( (err) =>{
          commit('setLoading', false);
          console.error(err);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then( ({data}) => {
          commit("setUserPosts", data.getUserPosts);
          // console.log(data.getUserPosts);
          
        } )
        .catch( err => {
          console.error(err);
          
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then( ({data}) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then( ({data}) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index +1),
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
          
        })
    },
    // //🌟🌟--------- Delete Message Posts ---------🌟🌟//
    // deleteMessage: ({state, payload}) => {
    //   apolloClient
    //     .mutate({
    //       mutation: DELETE_MESSAGE_POST,
    //       variables: payload
    //     })
    //     .then({data}) = state.userPosts.findIndex(
    //       message => post.messages._id == data.deleteMessage._id
    //     );
    //     const userPosts = [
    //       ...state.userPosts.slice(0, index),
    //       ...state.userPosts.slice(index +1 )
    //     ];
    //     commit("setUserPosts", userPosts);
    //     })
    //     .catch(err => {
    //       console.error(err);

    //     })
    // },

    //🌟🌟--------- Search Query ---------🌟🌟//
    searchPosts: ({ commit }, payload ) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then( ({data}) => {
        commit('setSearchResults', data.searchPosts);
        // console.log(data.searchPosts);
      })
      .catch(err => console.error(err))
    },

    addPost: ( {commit}, payload ) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } } ) => {
            // console.log(cache, data);
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            //Create updated data
            data.getPosts.unshift(addPost);
            //Write updated data back to query
            console.log(data.getPosts);
            cache.writeQuery({
              query: GET_POSTS,
              data    
            })
          },
          // Optimistic response ensures data is added inmmediately as we specified for the update function.
          optimisticResponse: {
            __typesnames: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          },
          // Return specified quiries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        }).then( ( {data} )  => {
          console.log(data.addPost);
          
        }).catch( err => {
          console.error(err);
          
        })
    },
    signinUser: ({ commit }, payload) => {
      commit('clearError');
      // clear token to prevent error if malformed
      localStorage.setItem('token', '');
      commit("setLoading", true);
      apolloClient
      .mutate({
        mutation: SIGNIN_USER,
        variables: payload
      })
      .then( ({ data }) => {
        commit("setLoading", false);
        localStorage.setItem( 'token', data.signinUser.token );
        // to make sure created method is run is main.js (we run getCurrentUser),
        // reload the page
        router.go();
        // console.log(data.signinUser);
      })
      .catch( err => {
        commit("setLoading", false);
        commit("setError", err);
        console.error(err);
      });
    },
    signupUser: ({ commit }, payload) => {
      commit('clearError');
      commit("setLoading", true);

      apolloClient
      .mutate({
        mutation: SIGNUP_USER,
        variables: payload
      })
      .then( ({ data }) => {
        commit("setLoading", false);
        localStorage.setItem( 'token', data.signupUser.token );
        // to make sure created method is run is main.js (we run getCurrentUser),
        // reload the page
        router.go();
        // console.log(data.signinUser);
      })
      .catch( err => {
        commit("setLoading", false);
        commit("setError", err);
        console.error(err);
      });
    },
    signoutUser: async ({ commit }) => {
       // clear user in state
      commit('clearUser');
       // remove token in localStorage
      localStorage.removeItem('token', '');
       // end session
      await apolloClient.resetStore();
      //  console.dir(apolloClient);

      //redirect home - kick user out of private page (i.e. profile)
      router.push('/')
    }
  },
  getters: {
    posts: state => state.posts,
    user: state => state.user,
    userPosts: state => state.userPosts,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError,
    userFavorites: state => state.user && state.user.favorites,
    searchResults: state => state.searchResults
  }
});
