<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '../node_modules/normalize.css/normalize.css';
@import url('https://fonts.googleapis.com/css?family=Montserrat');
@import './variables';

body {
  background-color: $white;
  color: $black;
}

#app {
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
