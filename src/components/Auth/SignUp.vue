<template>
  <v-container text-xs-center>
      <!-- Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h2 style="margin: 16px">Welcome welcome! 🦇 🗼 ⚔️</h2>
      </v-flex>
    </v-layout>

     <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message.replace('GraphQL error:', '')" type="error">
        </form-alert>
      </v-flex>
    </v-layout>

    <!-- <v-snackbar
      color="error" bottom leff
      v-model= "authSnackbar1"
      :timeout='6000'
      v-if="error">
      <v-icon class="mr-3" style="cursor: pointer">check_circle</v-icon>
      <form-alert :message="error.message" type="error"></form-alert>
      <v-btn dark flat @click.native="error = false">Close 😵</v-btn>
    </v-snackbar> -->

    <!-- Sign Up Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container style="margin-top: 12px">
            <h2 style="margin: 0">Sign up, let do some boring Form</h2>
            <v-form @submit.prevent="handleSignupUser" 
            v-model="isFormValid" lazy-validation ref="form">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field prepend-icon="face" 
                                label="Username" type="text" 
                                v-model="username" required
                                :rules="[rules.userReq1, rules.min2]"

                    ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field prepend-icon="email" 
                                label="Email" type="text" 
                                v-model="email" required
                                :rules="[rules.emailReq, rules.email]"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field prepend-icon="extension" label="Password" 
                                :type="show1 ? 'text' : 'password'" required
                                v-model="password"
                                :rules="[rules.passReq, rules.min]"
                                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                counter
                                @click:append="show1 = !show1"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <!-- :error-messages="passConfirm()" -->
                  <v-text-field prepend-icon="touch_app" label="Confirm Password"
                                v-model="password2" 
                                :rules="[rules.match]"
                                :type="show2 ? 'text' : 'password'"  required
                                :append-icon="show2 ? 'visibility_off' : 'visibility'"
                                counter
                                @click:append="show2 = !show2"></v-text-field>
                </v-flex>

              </v-layout>
              <v-divider></v-divider>
              <v-layout row ma-2>
                <v-flex xs12>
                  <v-select
                    v-bind="questions" 
                    color="primary"
                    dark
                    label="What the hex? Account Recovery Questions * "
                    solo
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field prepend-icon="flight_land" 
                                label="Question Answer" type="text" 
                                
                              
                    ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn prepend-icon="submit" color="accent" 
                         label="Password" type="submit" required
                         :loading="loading"
                         :disabled="!isFormValid || loading"
                         @click="loader = loading">Sign Up
                    <span slot="loader" style="fill: black" class="custom-loader">
                      <v-icon darken-1>cached</v-icon>
                    </span>
                  </v-btn>  
                  <h3>Already have an account 💪?
                    <router-link color="accent" to="/signIn" style="color: white">Sign Up</router-link>
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
  // const pattern = /.@+./
  import { mapGetters } from 'vuex';
  export default {
    name: "SignUp",
    data() {
      return {
        email:'',
        username:'',
        password:'',
        password2:'',
        isFormValid: true,
        show1: false,
        show2: false,
        authSnackbar1: false,
        rules: {
          //Validation
          emailReq: email => !!email || 'Email is required 😼',
          userReq1: userReq1 => !!userReq1 || 'Username is required 😼',
          min2: value => value.length >= 4 || 'Minimum username must be at least 4 characters ✌️ ',
          passReq: password => !!password || 'Password is required 🤕',
          min: v2 => v2.length >= 8 || 'Minimum password must be at least 8 characters ✌️ ',
          email: validEm => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(validEm) || 'Invalid e-mail. 📦';
          },
          match: () => {
            return ( this.password === this.password2 || 'Password must Match 🛠 ⚙️' );
          }
        },
        questions: {
          items: [
            'Item 1',
            'Item 2',
            'Item 3',
            'Item 4'
          ]
        }
      }
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
    computed: {
      ...mapGetters(['error', 'user', 'loading'])
    },
    methods: {
      handleSignupUser(){
        if (this.$refs.form.validate()) {
          this.$store.dispatch('signupUser', {
            username: this.username,
            email: this.email,
            password: this.password
          })
        }
      },
      // passConfirm() {
      //   return ( this.password === this.password2 ? '' : 'Password must Match 🛠 ⚙️' );
      // }
    }
    
  }
</script>

<style scoped>
  .theme--dark.v-btn.v-btn--disabled:not(.v-btn--icon):not(.v-btn--flat):not(.v-btn--outline) {
   background-color: darkslategray !important;
 }
 h2{
   color: whitesmoke;
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
