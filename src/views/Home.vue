<template>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import router from '@/router';

@Component({
  beforeRouteEnter: (to: Route, from: Route, next: any) => {
    const jwt = localStorage.getItem('pwjwt');

    if (!jwt) {
      next((vm: Home) => {
        vm.$router.push('/');
      })
    }
  },
})
export default class Home extends Vue {
}
</script>
