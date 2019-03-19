<template>
  <div class="container">
    <nav>
      <div class="logo">
        <img src="logo.svg">
        vault
      </div>

      <div>
        <button @click="signOut()">
          Sign Out
        </button>
      </div>
    </nav>

    <main>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

interface VaultData {
  category: string;
  name: string;
  password: string;
}

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
  public data: VaultData[] = [];

  private http = (this as any).$http;
  private eb = (this as any).$eventBus;

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

  }

  public signOut() {
    localStorage.removeItem('vjwt');
    localStorage.removeItem('name');

    this.$router.push('/');
  }
}
</script>

<style lang="scss">
@import '../variables';

.container {
  margin: 0 auto;
  max-width: 1200px;

  nav {
    align-items: center;
    display: flex;
    height: 4rem;
    justify-content: space-between;

    .logo {
      align-items: center;
      display: flex;
      font-size: 2rem;
      font-weight: 700;
    }

    button {
      background-color: $white;
      border: 1px solid darken($purple, 15%);
      border-radius: 3px;
      color: darken($purple, 15%);
      cursor: pointer;
      outline: none;
      padding: .5rem;
      transition: all .3s ease;

      &:hover {
        background-color: lighten($purple, 30%);
      }

      &:active {
        background-color: lighten($purple, 20%);
      }
    }
  }

  main {
    background: $white;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14),
                0 1px 5px 0 rgba(0, 0, 0, .12),
                0 3px 1px -2px rgba(0, 0, 0, .2);
    margin: 2rem 0;
    min-height: 10rem;
  }

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
