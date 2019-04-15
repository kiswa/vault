<template>
  <div id="account-edit">
    <button @click="toggleMenu">
      My Account
    </button>

    <ul v-if="isOpen">
      <li @click="signOut">
        Sign Out
      </li>

      <li @click="toggleChangePassword"
        :class="{ 'no-hover': isPasswordChangeOpen }">
        Change Password

        <div id="passwordChangeForm" v-if="isPasswordChangeOpen" @click.stop>
          <label>
            New Password:
            <password-toggle v-model="pword"></password-toggle>
          </label>

          <label>
            Verify Password:
            <password-toggle v-model="vPword"></password-toggle>
          </label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import PasswordToggle from '@/components/PasswordToggle.vue';

@Component({
  components: {
    PasswordToggle,
  },
})
export default class AccountEdit extends Vue {
  private eb = (this as any).$eventBus;

  private isOpen = false;
  private isPasswordChangeOpen = false;

  private pword = '';
  private vPword = '';

  public toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  public toggleChangePassword() {
    this.isPasswordChangeOpen = !this.isPasswordChangeOpen;

    this.pword = '';
    this.vPword = '';
  }

  public signOut() {
    this.eb.$emit('sign-out');
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

#account-edit {
  position: relative;

  ul {
    background-color: $white;
    border: 1px solid $black;
    border-radius: 3px;
    border-top-right-radius: 0;
    cursor: pointer;
    list-style: none;
    padding: 0;
    position: absolute;
    right: 0;
    text-align: left;
    top: 18px;
    user-select: none;
    width: auto;
    z-index: 100;

    li {
      padding: 1rem;
      transition: all .3s ease;
      white-space: nowrap;

      &:hover {
        background-color: lighten($purple, 30%)
      }

      &.no-hover {
        background-color: $white;
      }
    }

    #passwordChangeForm {
      background-color: $white;
    }
  }
}
</style>

