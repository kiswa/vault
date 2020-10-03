<template>
<div class="display">
  <div v-if="data.length === 0">
    No entries found.
  </div>

  <header v-if="data.length">
    <div class="header">
      Product

      <span class="header-controls">
        <filter-input placeholder='Filter by product'
                      @filter-input="filterData($event, 'product')">
        </filter-input>

        <span class="sort"
              :class="{ active: currentSort === 'product',
              up: sortDir === 'DESC' }"
              @click="sortBy('product')">

          <i v-if="data.length > 1">
            <img svg-inline src="../../public/angle-down.svg" />
          </i>
        </span>
      </span>
    </div>

    <div class="header">
      Category

      <span class="header-controls">
        <filter-input placeholder='Filter by category'
                      @filter-input="filterData($event, 'category')">
        </filter-input>

        <span class="sort"
              :class="{ active: currentSort === 'category',
              up: sortDir === 'DESC' }"
              @click="sortBy('category')">
          <i v-if="data.length > 1">
            <img svg-inline src="../../public/angle-down.svg" />
          </i>
        </span>
      </span>
    </div>

    <div class="header">
      Username

      <span class="header-controls">
        <filter-input placeholder='Filter by username'
                      @filter-input="filterData($event, 'name')">
        </filter-input>

        <span class="sort"
              :class="{ active: currentSort === 'name',
              up: sortDir === 'DESC' }"
              @click="sortBy('name')">
          <i v-if="data.length > 1">
            <img svg-inline src="../../public/angle-down.svg" />
          </i>
        </span>
      </span>
    </div>

    <div>Password</div>

    <div class="icons">Actions</div>
  </header>

  <div class="body">
    <div class="row" v-for="item in filteredData" :key="item.id">
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
             @click="toggleShowPassword(item)">

        <img svg-inline src="../../public/eye-line.svg"
             v-if="item.showPassword"
             @click="toggleShowPassword(item)">

        <span class="copy-wrapper">
          <img svg-inline src="../../public/copy.svg"
               @click="copy(item)">

          <span v-if="item.copyStatus.length">
            {{ item.copyStatus }}
          </span>
        </span>

        <img svg-inline src="../../public/edit.svg"
             @click="$emit('edit', item)">

        <img svg-inline src="../../public/delete.svg"
             @click="confirmDelete(item)">
      </div>
    </div>
  </div>

  <div class="mobile">
    <div class="row" v-for="item in data" :key="item.id">
      <div><label>Product</label> {{ item.product }}</div>
      <div><label>Category</label> {{ item.category }}</div>
      <div><label>Username</label> {{ item.name }}</div>

      <div class="pword">
        <label>Password</label>
        <span :title="item.showPassword ? item.password : ''">
          {{ item.showPassword ? item.password : item.passwordMask }}
        </span>
      </div>

      <div class="overflow">
        <label>Actions</label>
        <span class="icons">
          <img svg-inline src="../../public/eye.svg"
                          v-if="!item.showPassword"
                          @click="toggleShowPassword(item)">

          <img svg-inline src="../../public/eye-line.svg"
                          v-if="item.showPassword"
                          @click="toggleShowPassword(item)">

          <span class="copy-wrapper">
            <img svg-inline src="../../public/copy.svg"
                            @click="copy(item)">

            <span v-if="item.copyStatus.length">
              {{ item.copyStatus }}
            </span>
          </span>

          <img svg-inline src="../../public/edit.svg"
                          @click="$emit('edit', item)">

          <img svg-inline src="../../public/delete.svg"
                          @click="confirmDelete(item)">
        </span>
      </div>

    </div>
  </div>

  <div class="modal-bg" v-if="showConfirmDelete"
       @click="showConfirmDelete = false"></div>

  <div class="confirm-delete" tabindex="0" id="delete-modal"
       v-show="showConfirmDelete" @keyup.esc="showConfirmDelete = false">
    <div class="header">
      Confirm Password Delete
      <span @click="showConfirmDelete = false">X</span>
    </div>

    <div class="body">
      <p class="left">
        The credentials for
        <strong>{{ itemToDelete && itemToDelete.product }}</strong>
        will be deleted.
      </p>

      <p><strong>This cannot be undone.</strong></p>
    </div>

    <div class="buttons">
      <button class="danger" @click="deleteItem()">Delete</button>
      <button @click="showConfirmDelete = false">Cancel</button>
    </div>
  </div>

</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

import * as sjcl from 'sjcl';
import * as clipboard from 'clipboard-polyfill';

import FilterInput from '@/components/FilterInput.vue';
import { VaultData } from '@/models/vault-data';
import { ApiResponse } from '@/models/api-response';

@Component({
  components: {
    FilterInput,
  },
})
export default class CredentialsList extends Vue {
  private http = (this as any).$http;
  private eb = (this as any).$eventBus;

  private data: VaultData[] = [];
  private filteredData: VaultData[] = [];
  private itemToDelete: VaultData | null = null;
  private modal: any = null;

  private currentSort = 'product';
  private sortDir = 'ASC';

  private showConfirmDelete = false;

  public created() {
    const jwt = localStorage.getItem('vjwt');
    this.http.defaults.headers.common.Authorization = 'Bearer ' + jwt;

    this.eb.$on('update-data', (newData: ApiResponse) => {
      this.parseData(newData);
    });
  }

  public mounted() {
    this.getUserData();
    this.modal = document.getElementById('delete-modal');
  }

  public copy(item: any) {
    clipboard.writeText(item.password).then(() => {
      item.copyStatus = 'Copied to clipboard!';
    },
    () => {
      item.copyStatus = 'Something went wrong, please try again.';
    });

    setTimeout(() => {
      item.copyStatus = '';
    }, 1500);
  }

  public confirmDelete(item: VaultData) {
    this.itemToDelete = item;
    this.showConfirmDelete = true;

    this.modal.focus();
  }

  private filterData(event: string, column: string) {
    const filter = event.toLowerCase();
    const isEmpty = event === '';

    this.filteredData = [];

    this.data.forEach((item) => {
      const value = item[column].toLowerCase();
      const hasFilter = value.indexOf(filter) >= 0;

      if (hasFilter || isEmpty) {
        this.filteredData.push(item);
      }
    });
  }

  private toggleShowPassword(item: any) {
    item.showPassword = !item.showPassword;
  }

  private async deleteItem() {
    if (!this.itemToDelete) {
      return;
    }

    try {
      const response = await
        this.http.delete('user/item/' + this.itemToDelete.id);
      const result: ApiResponse = response.data;

      this.parseData(result);
      this.$emit('editCancel', this.itemToDelete);

      this.itemToDelete = null;
      this.showConfirmDelete = false;

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

    this.filteredData.sort((a, b) => {
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

      for (const char of item.password) {
        item.passwordMask += '*';
      }
    });

    this.data = response.data.slice();
    this.filterData('', 'product');
    // For the first call, use an opposite value
    this.sortDir = this.sortDir === 'ASC' ? 'DESC' : 'ASC';
    this.sortBy(this.currentSort);
  }
}
</script>

<style lang="scss" scoped>
@import '../variables';

.modal-bg {
  background: rgba(.5, .5, .5, .5);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

#delete-modal {
  background: $white;
  border-radius: 3px;
  box-shadow: 0 12px 15px 0 rgba(0, 0, 0, .22),
              0 17px 20px 0 rgba(0, 0, 0, .12);
  left: calc(50% - 10rem);
  position: absolute;
  top: 2rem;
  width: 20rem;

  &:focus {
    outline: none;
  }

  .header {
    background-color: $blue;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: $white;
    display: flex;
    justify-content: space-between;
    padding: 1rem;

    span {
      cursor: pointer;
      font-weight: bold;
    }
  }

  .body {
    padding: 1rem;
  }

  .buttons {
    display: flex;
    justify-content: space-evenly;
    padding: 0 1rem 1rem;

    button {
      background-color: $white;
      color: $purple;

      &:hover {
        background-color: darken($white, 3%);
      }

      &:active {
        background-color: darken($white, 5%);
      }

      &.danger {
        background-color: $error;
        border: 1px solid darken($error, 5%);
        color: $white;

        &:hover {
          background-color: darken($error, 3%);
        }

        &:active {
          background-color: darken($error, 5%);
        }
      }
    }
  }
}

.display {
  padding: 1rem;

  @media (max-width: $breakpoint-mobile) {
    height: calc(100vh - 250px);
    overflow: auto;
  }

  .mobile {
    display: none;

    @media (max-width: $breakpoint-mobile) {
      display: block;

      .row {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;

        &:last-of-type {
          margin-bottom: 0;
        }

        label {
          font-weight: bold;
        }

        .overflow {
          overflow: visible;
        }
      }
    }
  }

  header,
  .row {
    display: flex;
    justify-content: space-around;

    @media (max-width: $breakpoint-mobile) {
      display: none;
    }

    div {
      display: flex;
      flex: 1;
      justify-content: space-between;
      line-height: 2;
      margin-right: .5rem;
      overflow: hidden;
      text-align: left;

      &:last-of-type {
        margin-right: 0;
      }

      .sort {
        color: lighten($grey, 25%);

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
    overflow: visible;

    .header {
      overflow: visible;
      position: relative;
    }

    .header-controls {
      display: flex;

      .sort {
        margin-left: .3rem;
      }
    }
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
    min-width: 5rem;
    overflow: visible!important;

    @media (max-width: $breakpoint-tablet) {
      min-width: 7rem;
    }

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
        padding-left: .5rem;
        position: absolute;
        right: -7.5rem;
        top: -1.8rem;
        width: 9rem;

        @media (max-width: $breakpoint-tablet) {
          right: -3.5rem;
        }

        @media (max-width: $breakpoint-mobile-small) {
          right: -2.5rem;
        }

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

          @media (max-width: $breakpoint-tablet) {
            left: 77px;
          }

          @media (max-width: $breakpoint-mobile-small) {
            left: 92px;
          }
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

