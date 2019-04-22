<template>
<div class="display">
  <div v-if="data.length === 0">
    No entries found.
  </div>

  <header v-if="data.length">
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
        <div :title="item.showPassword ? item.password : ''">
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

        <img svg-inline src="../../public/delete.svg"
             @click="deleteItem(item.id)">
      </div>
    </div>
  </div>

</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

import * as sjcl from 'sjcl';

import { VaultData } from '@/models/vault-data';
import { ApiResponse } from '@/models/api-response';

@Component({})
export default class CredentialsList extends Vue {
  private http = (this as any).$http;
  private eb = (this as any).$eventBus;

  private data: VaultData[] = [];
  private currentSort = 'product';
  private sortDir = 'ASC';

  public created() {
    const jwt = localStorage.getItem('vjwt');
    this.http.defaults.headers.common.Authorization = 'Bearer ' + jwt;

    this.eb.$on('update-data', (newData: ApiResponse) => {
      this.parseData(newData);
    });
  }

  public mounted() {
    this.getUserData();
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

  public async deleteItem(itemId: number) {
    try {
      const response = await this.http.delete('user/item/' + itemId);
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
    }
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

<style lang="scss" scoped>
@import '../variables';

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
</style>

