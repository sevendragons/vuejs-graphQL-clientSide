<template>
  <v-container text-xs-center>
    <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>
    <v-card color="info2" class="pa-2">

      <!-- Title -->
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <h2>Add Post Here ⚽️ 🏹 🎗</h2>
        </v-flex>
      </v-layout>
         

      <!-- Add Post Form -->
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>

          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">

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
                <v-textarea :rules="descRules" v-model="description" 
                            label="Description" type="text" 
                            required counter></v-textarea>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12>
                <v-btn :loading="loading" :disabled="!isFormValid || loading" color="accent" type="submit">
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                  Submit</v-btn>
              </v-flex>
            </v-layout>`

          </v-form>
        </v-flex>
      </v-layout>
    </v-card>

    
  </v-container>
</template>

<script>
  // const pattern = /.@+./
  import { mapGetters } from 'vuex';
  export default {
    name: "AddPost",
    data() {
      return {
        isFormValid: true,
        title: '',
        imageUrl: '',
        categories: '',
        description: '',
        
        titleRules: [
          title => !!title || "Title is required",
          title => title.length < 20 || "Title must have less than 20 characters"
        ],
        imageRules: [image => !!image || "Image is required"],
        categoriesRules: [
          categories =>
            categories.length >= 1 || "At least one category is required"
        ],
        descRules: [
          desc => !!desc || "Description is required",
          desc => desc.length < 200 || "Description must have less than 200 characters"
        ],
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
      handleAddPost() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('addPost', {
            title: this.title,
            imageUrl: this.imageUrl,
            categories: this.categories,
            description: this.description,
            creatorId: this.user._id
          });
          this.$router.push("/");
        }
      },
      // passConfirm() {
      //   return ( this.password === this.password2 ? '' : 'Password must Match 🛠 ⚙️' );
      // }
    }
    
  }
</script>

<style scoped>
  
</style>
