<template>
  <div class="container">
    <nav>
      <div class="logo">
        <img src="logo.svg">
        <h1>vault</h1>
      </div>

      <account-edit></account-edit>
    </nav>

    <main>
      <add-edit :value="addEdit" :isEdit="isEdit"
                @submit="addEditItem"></add-edit>

      <div class="list">
        <h2>Stored Credentials</h2>

        <credentials-list @edit="edit" @editCancel="cancelEdit"></credentials-list>
      </div>
    </main>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

import * as sjcl from 'sjcl';

import AddEdit from '@/components/AddEdit.vue';
import CredentialsList from '@/components/CredentialsList.vue';
import AccountEdit from '@/components/AccountEdit.vue';

import { VaultData } from '@/models/vault-data';
import { ApiResponse } from '@/models/api-response';

@Component({
  components: {
    AddEdit,
    CredentialsList,
    AccountEdit,
  },

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
  private eb = (this as any).$eventBus;

  private addEdit = new VaultData();
  private isEdit = false;

  public created() {
    const jwt = localStorage.getItem('vjwt');
    this.http.defaults.headers.common.Authorization = 'Bearer ' + jwt;

    const name = localStorage.getItem('name');
    if (name) {
      document.title = `vault - ${name}`;
    }

    this.eb.$off('cancel-edit');
    this.eb.$on('cancel-edit', () => {
      this.addEdit = new VaultData();
      this.isEdit = false;
    });

    this.eb.$off('sign-out');
    this.eb.$on('sign-out', this.signOut);
  }

  public edit(item: VaultData) {
    this.isEdit = true;
    this.addEdit = item;
  }

  public cancelEdit(item: VaultData) {
    if (item !== this.addEdit) {
      return;
    }

    this.isEdit = false;
    this.addEdit = new VaultData();
  }

  public async addEditItem() {
    const jwt = (localStorage.getItem('vjwt') as string);
    const cipher = sjcl.encrypt(jwt, JSON.stringify(this.addEdit.password));

    const data = { ...this.addEdit };
    data.password = JSON.stringify(cipher);

    this.eb.$emit('reset-password-toggle');

    try {
      const response = this.isEdit
        ? await this.http.put('user/item', data)
        : await this.http.post('user/item', data);
      const result: ApiResponse = response.data;

      result.alerts.forEach((alert) => {
        this.eb.$emit('notify', {
          type: 'success',
          message: alert,
        });
      });

      this.eb.$emit('update-data', result);
    } catch (ex) {
      this.handleError(ex);
    } finally {
      this.isEdit = false;
      this.addEdit = new VaultData();
    }
  }

  public signOut() {
    localStorage.removeItem('vjwt');
    localStorage.removeItem('name');

    this.eb.$emit('notify', {
      type: 'info',
      message: 'You have been signed out.',
    });
    this.$router.push('/');
  }

  private handleError(err: any) {
    if (err.response.status === 401) {
      err.response.data.alerts.forEach((message: string) => {
        this.eb.$emit('notify', { type: 'error', message });
      });

      localStorage.removeItem('vjwt');
      localStorage.removeItem('name');

      return;
    }

    this.eb.$emit('notify', {
      type: 'error',
      message: 'Something went wrong. Please try again.',
    });
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

    h1 {
      font-size: 2.5rem;
      margin-left: -1rem;
    }

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
      padding: .5rem .75rem;
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
    align-items: flex-start;
    display: flex;
    justify-content: space-between;
    margin: 2rem 0;

    button,
    input {
      background-color: $white;
      border: 1px solid darken($purple, 5%);
      border-radius: 3px;
      cursor: pointer;
      outline: none;
      padding: .5rem;
      transition: all .3s ease;
    }

    button {
      align-self: center;
      background-color: $purple;
      color: $white;
      width: 33%;

      &:hover {
        background-color: darken($purple, 5%);
      }

      &:active {
        background-color: darken($purple, 15%);
      }
    }

    input {
      cursor: default;
      padding: 5px 5px 3px;
    }

    .add,
    .list {
      background: $white;
      border-radius: 3px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14),
                  0 1px 5px 0 rgba(0, 0, 0, .12),
                  0 3px 1px -2px rgba(0, 0, 0, .2);
      margin-bottom: 1rem;

      h2 {
        border-bottom: 1px solid lighten($black, 60%);
        margin: 0;
        padding: 1rem;
      }
    }

    .list {
      flex: 1;
      margin-left: 1rem;
    }

  }
}
</style>
