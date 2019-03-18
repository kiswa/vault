<template>
  <div id="app">
    <router-view/>

    <notifications></notifications>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Notifications from '@/components/Notifications.vue';

@Component({
  components: {
    Notifications,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
@import '../node_modules/normalize.css/normalize.css';
@import url('https://fonts.googleapis.com/css?family=Montserrat');
@import './variables';

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

html, body {
  height: 100%;
}

body {
  background: $blue;
  background: linear-gradient(180deg,
                              lighten($blue, 3%) 0%,
                              $blue 35%,
                              darken($blue, 7%) 100%);
  color: $black;
}

input {
  background-color: $white;
  outline: none;
}

#app {
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 1rem;
}
</style>
