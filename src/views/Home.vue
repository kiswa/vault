<template>
  <div class="container">
    <div class="add">
      <h2>Add to your vault</h2>
    </div>

    <div class="display">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component({
  beforeRouteEnter: (to: Route, from: Route, next: any) => {
    const jwt = localStorage.getItem('vjwt');

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
    const jwt = localStorage.getItem('vjwt');
    this.http.defaults.headers.common.Authorization = 'Bearer ' + jwt;

    const name = localStorage.getItem('name');
    if (name) {
      document.title = `vault - ${name}`;
    }
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

<style lang="scss">
@import '../variables';

.container {
  margin: 0 auto;
  max-width: 1200px;

  .add,
  .display {
    background: $white;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14),
                0 1px 5px 0 rgba(0, 0, 0, .12),
                0 3px 1px -2px rgba(0, 0, 0, .2);
    min-height: 10rem;

    margin-bottom: 1rem;
  }

  .add {
    h2 {
      border-bottom: 1px solid lighten($black, 60%);
      margin: 0;
      padding: 1rem;
    }
  }
}
</style>
