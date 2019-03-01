import Vue from 'vue';
import Router from 'vue-router';

import Home from '../components/Home.vue';
import Posts from '../components/Posts/Posts.vue';
import Post from '../components/Posts/Post.vue';
import AddPost from '../components/Posts/AddPost';
import Undefined from '../components/Posts/Undefined';
import Profile from '../components/Auth/Profile.vue';
import SignIn from '../components/Auth/SignIn.vue';
import SignUp from '../components/Auth/SignUp.vue';
import AuthGuard from './AuthGuard';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/posts/undefined',
      name: 'Undefined',
      component: Undefined,
      beforeEnter: AuthGuard
    },
    {
      path: "/posts/:postId",
      name: "Post",
      component: Post,
      props: true
    },
    {
      path: '/posts',
      name: 'posts',
      component: Posts
    },
    {
      path: '/post/addPost',
      name: 'AddPost',
      component: AddPost,
      beforeEnter: AuthGuard
    },
  ]
})

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
// component: () => import(/* webpackChunkName: "about" */ './views/About.vue')