<template>
  <div class="container">

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component({
  beforeRouteEnter: (to: Route, from: Route, next: any) => {
    const jwt = localStorage.getItem('pwjwt');

    if (!jwt) {
      next((vm: Home) => {
        vm.$router.push('/');
      });
    }

    next(async (vm: Home) => {
      const http = (vm as any).$http;
      http.defaults.headers.common.Authorization = 'Bearer ' + jwt;

      try {
        await http.post('auth', null);
      } catch (ex) {
        vm.$router.push('/');
      }
    });
  },
})
export default class Home extends Vue {
  private http = (this as any).$http;

  public created() {
    const jwt = localStorage.getItem('pwjwt');
    this.http.defaults.headers.common.Authorization = 'Bearer ' + jwt;
  }

  public mounted() {
    this.getUserData();
  }

  public async getUserData() {
    const { data } = await this.http.get('data');

    console.log(data); // tslint:disable-line
  }

}
</script>
