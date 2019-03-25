<template>
  <div class="container">
    <nav>
      <div class="logo">
        <img src="logo.svg">
        <h1>vault</h1>
      </div>

      <button @click="signOut()">
        Sign Out
      </button>
    </nav>

    <main>
      <add-edit :value="addEdit" :isEdit="isEdit"
                @submit="addEditItem"></add-edit>

      <div class="list">
        <!-- TODO: Make component. -->
        <h2>Stored Credentials</h2>

        <div class="display">
          <div v-if="data.length === 0">
            No entries found.
          </div>

          <header>
            <div>
              Product
              <span :class="{ active: currentSort === 'product',
                              up: sortDir === 'DESC' }"
                    @click="sortBy('product')">
                <i v-if="data.length > 1">
                  <img svg-inline src="../../public/angle-down.svg" />
                </i>
              </span>
            </div>

            <div>
              Category
              <span :class="{ active: currentSort === 'category',
                              up: sortDir === 'DESC' }"
                    @click="sortBy('category')">
                <i v-if="data.length > 1">
                  <img svg-inline src="../../public/angle-down.svg" />
                </i>
              </span>
            </div>

            <div>
              Username
              <span :class="{ active: currentSort === 'name',
                              up: sortDir === 'DESC' }"
                    @click="sortBy('name')">
                <i v-if="data.length > 1">
                  <img svg-inline src="../../public/angle-down.svg" />
                </i>
              </span>
            </div>

            <div>Password</div>

            <div class="icons">Actions</div>
          </header>

          <div class="body">
            <div class="row" v-for="item in data" :key="item.id">
              <div>{{ item.product }}</div>

              <div>{{ item.category }}</div>

              <div>{{ item.name }}</div>

              <div class="pword">
                <div :class="item.showPassword ? '' : 'hidden'">
                  {{ item.showPassword ? item.password : item.passwordMask }}
                </div>
              </div>

              <div class="icons">
                <img svg-inline src="../../public/eye.svg"
                     v-if="!item.showPassword"
                     @click="item.showPassword = !item.showPassword">

                <img svg-inline src="../../public/eye-line.svg"
                     v-if="item.showPassword"
                     @click="item.showPassword = !item.showPassword">

                <span class="copy-wrapper">
                  <img svg-inline src="../../public/copy.svg"
                       @click="copy(item)">

                  <span v-if="item.copyStatus.length">
                    {{ item.copyStatus }}
                  </span>
                </span>

                <img svg-inline src="../../public/edit.svg"
                     @click="edit(item)">

                <img svg-inline src="../../public/delete.svg">
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

import * as sjcl from 'sjcl';

import AddEdit from '@/components/AddEdit.vue';
import { VaultData } from '@/models/vault-data';
import { ApiResponse } from '@/models/api-response';

@Component({
  components: {
    AddEdit,
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

  private data: VaultData[] = [];
  private addEdit = new VaultData();
  private isEdit = false;
  private currentSort = 'product';
  private sortDir = 'ASC';

  public created() {
    const jwt = localStorage.getItem('vjwt');
    this.http.defaults.headers.common.Authorization = 'Bearer ' + jwt;

    const name = localStorage.getItem('name');
    if (name) {
      document.title = `vault - ${name}`;
    }

    this.eb.$on('cancel-edit', () => {
      this.addEdit = new VaultData();
      this.isEdit = false;
    });
  }

  public mounted() {
    this.getUserData();
  }

  public edit(item: VaultData) {
    this.isEdit = true;
    this.addEdit = item;
  }

  public copy(item: any) {
    const nav = (navigator as any);

    nav.clipboard.writeText(item.password).then(() => {
      item.copyStatus = 'Copied to clipboard!';
    },
    () => {
      item.copyStatus = 'Something went wrong.';
    });

    setTimeout(() => {
      item.copyStatus = '';
    }, 1500);
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

      this.parseData(result);

      result.alerts.forEach((alert) => {
        this.eb.$emit('notify', {
          type: 'success',
          message: alert,
        });
      });
    } catch (ex) {
      this.eb.$emit('notify', {
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
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

  private sortBy(column: string) {
    if (this.currentSort === column) {
      this.sortDir = this.sortDir === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortDir = 'ASC';
    }

    this.currentSort = column;

    this.data.sort((a, b) => {
      const aa = (a[column] as string).toLowerCase();
      const bb = (b[column] as string).toLowerCase();

      if (this.sortDir === 'DESC') {
        return bb > aa
          ? 1
          : bb < aa
            ? -1
            : 0;
      }

      return aa > bb
        ? 1
        : aa < bb
          ? -1
          : 0;
    });
  }

  private async getUserData() {
    try {
      const { data } = await this.http.get('user/data');

      this.parseData(data);
    } catch (ex) {
      this.eb.$emit('notify', {
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
    }
  }

  private parseData(response: ApiResponse) {
    const jwt = (localStorage.getItem('vjwt') as string);

    response.data.forEach((item: any) => {
      item.password = JSON.parse(sjcl.decrypt(jwt, item.password));

      item.copyStatus = '';
      item.passwordMask = '';
      item.showPassword = false;

      for (let i = 0; i < item.password.length; i++) { // tslint:disable-line
        item.passwordMask += '*';
      }
    });

    this.data = response.data.slice();
    this.sortDir = 'DESC'; // For the first call, use an opposite value
    this.sortBy('product');
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

      .display {
        padding: 1rem;

        header,
        .row {
          display: flex;
          justify-content: space-around;

          div {
            display: flex;
            flex: 1;
            justify-content: space-between;
            line-height: 2;
            margin-right: .5rem;
            overflow: hidden;

            &:last-of-type {
              margin-right: 0;
            }

            span {
              color: lighten($grey, 25%);
              width: 32px;

              &.active {
                color: $black;

                &.up {
                  svg {
                    transform: rotate(180deg);
                  }
                }
              }
            }

            svg {
              cursor: pointer;
              transition: all .3s;
              width: 12px;
            }
          }
        }

        header {
          font-weight: bold;
        }

        .row:nth-of-type(even) {
          background-color: lighten($black, 77%);
        }

        .pword {
          display: flex;
          justify-content: space-between;

          div:nth-of-type(1) {
            display: block;
            overflow: hidden;
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .hidden {
            margin-bottom: -5px;
            padding-top: 5px;
          }
        }

        .icons {
          align-items: center;
          display: flex;
          flex: .5!important;
          justify-content: space-around;
          overflow: visible!important;

          .copy-wrapper {
            line-height: normal;
            position: relative;
            width: auto;

            span {
              background-color: $info;
              border: 1px solid $purple;
              border-radius: 5px;
              box-shadow: 0 12px 15px 0 rgba(0, 0, 0, .22),
                          0 17px 20px 0 rgba(0, 0, 0, .12);
              color: $white;
              font-size: .8rem;
              padding: .2rem;
              position: absolute;
              right: -9.5rem;
              top: -1.8rem;
              width: 11rem;

              &::before {
                background: #4b7ec1;
                border-bottom: 1px solid #757083;
                border-right: 1px solid #757083;
                bottom: -5px;
                content: ' ';
                display: block;
                height: 10px;
                left: 7px;
                position: absolute;
                transform: rotate(45deg);
                width: 10px;
              }
            }
          }

          svg {
            color: $purple;
            cursor: pointer;
            margin: 0;
            width: 16px!important;
          }
        }

      }
    }

  }
}
</style>
