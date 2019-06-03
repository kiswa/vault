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
            <span class="error">{{ errPword }}</span>
          </label>

          <label>
            Verify Password:
            <password-toggle v-model="vPword"></password-toggle>
            <span class="error">{{ errVPword }}</span>
          </label>

          <div class="buttons">
            <button class="primary" @click="updatePassword">Save</button>
            <button class="secondary"@click="cancelChange"> Cancel </button>
          </div>
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
  private isUpdating = false;

  private pword = '';
  private vPword = '';
  private errPword = '';
  private errVPword = '';

  public toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  public toggleChangePassword() {
    this.isPasswordChangeOpen = !this.isPasswordChangeOpen;

    this.reset();
  }

  public signOut() {
    this.eb.$emit('sign-out');
  }

  public updatePassword() {
    this.errPword = '';
    this.errVPword = '';

    if (!this.pword.length) {
      this.errPword = 'You must enter a new password.';
      return;
    }

    if (this.pword !== this.vPword) {
      this.errVPword = 'Passwords do not match.';
      return;
    }
  }

  public cancelChange() {
    this.isPasswordChangeOpen = false;
    this.reset();
  }

  private reset() {
    this.errPword = '';
    this.errVPword = '';
    this.pword = '';
    this.vPword = '';
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

      label {
        display: block;
        margin-top: 1rem;
      }

      input {
        background-color: $white;
        border: 1px solid darken($purple, 5%);
        border-radius: 3px;
        cursor: pointer;
        margin-top: .3rem;
        outline: none;
        padding: .5rem;
        transition: all .3s ease;
      }

      .error {
        color: $error;
        font-size: .8rem;
        font-weight: bold;
        margin-top: 5px;
      }

      .buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        width: 13rem;

        button {
          background-color: $purple;
          color: $white;
          width: 45%;

          &:hover {
            background-color: darken($purple, 5%);
          }

          &:active {
            background-color: darken($purple, 15%);
          }

          &.secondary {
            background-color: $white;
            color: $purple;

            &:hover {
              background-color: darken($white, 3%);
            }

            &:active {
              background-color: darken($white, 5%);
            }
          }
        }
      }
    }
  }
}
</style>

