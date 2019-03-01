<template>
  <v-alert type="error" color="error" 
           icon="warning" :value="true" dismissible
           transition="scale-transition">
    <h3>{{ message }}</h3>
  </v-alert>

  <!-- <v-alert type="error" color="error" 
           icon="warning" v-model="alert">
    <h3>{{ message }}</h3>
  </v-alert> -->
</template>

<script>
  export default {
    name: 'FormAlert',
    props: ['message'],
    // data() {
    //   return {
    //     alert: false
    //   }
    // }
  }
</script>

<style scoped>

</style>
