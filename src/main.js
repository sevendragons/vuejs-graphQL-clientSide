import Vue from 'vue'
import './plugins/vuetify'
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import "@babel/polyfill";

import App from './App.vue'
import router from './router/router'
import store from './store'
import FormAlert from './components/Shared/FormAlert'

// import { Query } from 'mongoose';
Vue.component('form-alert', FormAlert);

/*-------------- Set up Apollo Client and Vue-Apollo --------------*/
Vue.use(VueApollo);

export const defaultClient = new ApolloClient({
  // uri: 'http://localhost:4500/graphql',
  uri: 'https://graphql-apolloserve.herokuapp.com',
  // include auth token with requests made to backend
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
      // if no token with key of 'token' in localstorage, add it
      if (!localStorage.token) {
        localStorage.setItem('token', '');
      }


      //operatio adds the token to an authorization header, which is send to backend
      operation.setContext({
        headers: {
          authorization: localStorage.getItem('token')
        }
      })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === 'AuthenticationError') {
          // set auth error in state (to show in snackbar)
          store.commit("setAuthError", err);
          // signout user (to clear token)
          store.dispatch("signoutUser")
        }
      }
    }
  }
});

// var filter = function (text, length, clamp) {
//   clamp = clamp || '...';
//   var node = document.createElement('div');
//   node.innerHTML = text;
//   var content = node.textContent;
//   return content.length > length ? content.slice(0, length) + clamp : content;
// };
// {{result.description | truncate(30, '...')}}  // in description App.vue
// Vue.filter('truncate', filter);


const apolloProvider = new VueApollo({ 
  defaultClient
});

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    // execute getCurrentUser Query
    this.$store.dispatch("getCurrentUser")
  }
}).$mount('#app')

// provide: apolloProvider.provide(),