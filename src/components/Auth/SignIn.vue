<template>
  <v-container text-xs-center>
    <!-- Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h2 style="color: whitesmoke; margin: 16px">Welcome Back! 🙀 🤟 😎</h2>
      </v-flex>
    </v-layout>

    <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message.replace('GraphQL error:', '')" >
        </form-alert>
      </v-flex>
    </v-layout>


    <!-- Sign in Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark round>
          <v-container style="margin-top: 12px">
          <h2 style="margin: 0">
            Sign In 🚪
          </h2>
            <v-form @submit.prevent="handleSigninUser"
                    v-model="isFormValdid"
                    lazy-validation ref="form">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field prepend-icon="email" 
                                :rules="[rules.emailReq, rules.email]"
                                label="Email" type="email" required
                                v-model="email"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field prepend-icon="extension" 
                                :rules="[rules.passReq, rules.min]"
                                label="Password"
                                v-model="password" required
                                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                counter
                                @click:append="show1 = !show1"
                                :type="show1 ? 'text' : 'password'"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn color="accent" type="submit" 
                         :loading="loading"
                         :disabled="!isFormValdid || loading"
                         @click="loader = loading">Sign In
                    <span slot="loader" style="fill: black" class="custom-loader">
                      <v-icon darken-1>cached</v-icon>
                    </span>
                  </v-btn>
                  <h3>Don't have an account 👺?
                    <router-link to="/signUp" style="color: white">Sign Up</router-link>
                  </h3>
                  <h3>Reset Password or Forgot Password 👺?
                    <router-link to="/signUp" style="color: white">Reset Password</router-link>
                  </h3>
                </v-flex>
              </v-layout>

            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>  
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: "SignIn",
    data() {
      return {
        email: "",
        password: "",
        loader: null,
        isFormValdid: true,
        show1: false,
        rules: {
          //Validation
          emailReq: email => !!email || 'Email is required 😼',
          passReq: password => !!password || 'Password is required 🤕',
          min: v => v.length >= 8 || 'Minimum password must be at least 8 characters ✌️ ',
          email: validEm => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(validEm) || 'Invalid e-mail. 📦'
          }
        }
      }
    },
    components: {

    },
    computed: {
      ...mapGetters(['user', 'error', 'loading']),
    },
    watch: {
      user(value) {
        // If user value changes, redirect to home page
        if (value) {
          this.$router.push("/")
        }
      },
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      }
    },
    methods: {
      handleSigninUser() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('signinUser', {
            email: this.email,
            password: this.password
          });
        }
      },
    }
  };
</script>

<style scoped>
.v-card {
  height: 500px;
}

.theme--dark.v-btn.v-btn--disabled:not(.v-btn--icon):not(.v-btn--flat):not(.v-btn--outline) {
   background-color: darkslategray !important;
 }
 .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
