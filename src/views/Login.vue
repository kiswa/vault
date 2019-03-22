<template>
  <div class="login">
    <h1>
      <img alt="vault" src="logo.svg">
      vault
    </h1>

    <label>
      User Name:
      <input type="text" id="uname" v-model="username"
             @keyup.enter="signInUp" />

      <span class="error" v-if="usernameError">
        {{ usernameError }}
      </span>
    </label>

    <label>
      Password:
      <password-toggle @keyup="resetErrors" v-model="password"
                       @keyup.enter="signInUp"></password-toggle>

      <span class="error" v-if="passwordError">
       {{ passwordError }}
      </span>
    </label>

    <transition name="fade">
      <label v-if="isSignUp">
        Verify Password:
        <password-toggle @keyup="resetErrors" v-model="verifyPassword"
                         @keyup.enter="signInUp"></password-toggle>

        <span class="error" v-if="verifyError">
          Verification password does not match original password.
        </span>
      </label>
    </transition>

    <button @click="signIn" :disabled="isLoading" v-if="!isSignUp">
      Sign In
    </button>

    <button @click="signUp" :disabled="isLoading"
      :class="{ active: isSignUp }" class="secondary">
      Sign Up
    </button>

    <button @click="resetErrors(); isSignUp = false" v-if="isSignUp"
            class="secondary" :disabled="isLoading">
      Cancel
    </button>
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
export default class Login extends Vue {
  public username = '';
  public password = '';
  public verifyPassword = '';

  public usernameError: string | null = null;
  public passwordError: string | null = null;
  public verifyError = false;
  public isSignUp = false;
  public isLoading = false;

  private http = (this as any).$http;
  private eb = (this as any).$eventBus;

  public mounted() {
    const el = document.getElementById('uname');

    if (el) {
      el.focus();
    }
  }

  public signInUp() {
    if (this.isSignUp) {
      this.signUp();

      return;
    }

    this.signIn();
  }

  public async signIn() {
    if (!this.validateSignIn()) {
      return;
    }

    this.isLoading = true;
    this.eb.$emit('reset-password-toggle');

    const { data } = await this.http.post('signin', {
      username: this.username,
      password: this.password,
    });

    this.notifyAlerts(data.status, data.alerts);

    if (data.status !== 'success') {
      this.passwordError = data.alerts[0];
      this.isLoading = false;

      return;
    }

    this.isLoading = false;
    this.redirectHome(data.data.token, data.data.name);
  }

  public async signUp() {
    this.resetErrors();

    if (!this.isSignUp) {
      this.isSignUp = true;

      return;
    }

    if (!this.validateSignUp()) {
      return;
    }

    this.isLoading = true;
    this.eb.$emit('reset-password-toggle');

    const { data } = await this.http.post('signup', {
      username: this.username,
      password: this.password,
      verify: this.verifyPassword,
    });

    this.notifyAlerts(data.status, data.alerts);

    if (data.status !== 'success') {
      this.usernameError = data.alerts[0];
      this.isSignUp = false;
      this.isLoading = false;

      return;
    }

    this.isLoading = false;
    this.redirectHome(data.data.token, data.data.name);
  }

  public resetErrors() {
    this.usernameError = null;
    this.passwordError = null;
    this.verifyError = false;
  }

  private notifyAlerts(status: string, alerts: string[]) {
    alerts.forEach((alert: string) => {
      this.eb.$emit('notify', { type: status, message: alert });
    });
  }

  private redirectHome(token: string, name: string) {
    localStorage.setItem('vjwt', token);
    localStorage.setItem('name', name);

    this.http.defaults.headers.common.Authorization =
      'Bearer ' + token;

    this.$router.push('home');
  }

  private validateSignIn() {
    let noErrors = true;

    if (this.username.length < 1) {
      this.usernameError = 'User name is required.';
      noErrors = false;
    }

    if (this.password.length < 1) {
      this.passwordError = 'Password is required.';
      noErrors = false;
    }

    return noErrors;
  }

  private validateSignUp() {
    let noErrors = true;

    if (this.username.length < 1) {
      this.usernameError = 'User name is required.';
    }

    if (this.password !== this.verifyPassword) {
      this.verifyError = true;
      noErrors = false;
    }

    if (this.password.length < 12) {
      this.passwordError = 'Password must be at least 12 characters long.';
      noErrors = false;
    }

    return noErrors;
  }
}
</script>

<style lang="scss">
@import '../variables';

.login {
  background-color: $white;
  border: 1px solid $purple;
  border-radius: 3px;
  box-shadow: 3px 7px 25px 0 rgba($black, .3);
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
  max-width: 100%;
  overflow: hidden;
  padding: 2rem;
  width: 20rem;

  .fade-enter-active,
  .fade-leave-active {
    transition: all .1s ease-out;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: rotateX(50deg);
  }

  .fade-enter-to,
  .fade-leave {
    opacity: 1;
    transform: rotateX(0deg);
  }

  h1 {
    align-items: center;
    background: $purple;
    background: linear-gradient(180deg,
                                lighten($purple, 5%) 0%,
                                $purple 35%,
                                lighten($purple, 5%) 100%);
    border-radius: 3px;
    color: $black;
    display: flex;
    flex-direction: column;
    margin: 0 0 2rem;
    padding-bottom: 1rem;

    img {
      margin-bottom: -1.7rem;
    }
  }

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    overflow: hidden;
    text-align: left;

    input {
      border: 1px solid $purple;
      border-radius: 3px;
      padding: 5px 5px 3px;
    }

    .error {
      color: $error;
      font-size: .8rem;
      font-weight: bold;
      margin-top: 5px;
    }
  }

  button {
    background-color: $purple;
    border: 1px solid darken($purple, 5%);
    border-radius: 3px;
    color: $white;
    cursor: pointer;
    margin-top: 1rem;
    outline: none;
    padding: .5rem 0;
    transition: all .3s ease;

    &[disabled],
    &.secondary[disabled],
    &.secondary.active[disabled]{
      background-color: lighten($grey, 15%);
      border: 1px solid $grey;
      color: $white;
      cursor: default;

      &:hover {
        background-color: lighten($grey, 15%);
      }
    }

    &:hover {
      background-color: darken($purple, 5%);
    }

    &:active {
      background-color: darken($purple, 15%);
    }

    &.secondary {
      background-color: $white;
      border-color: $green;
      color: $green;

      &:hover {
        background-color: darken($white, 2%);
      }

      &:active {
        background-color: darken($white, 5%);
      }

      &.active {
        background-color: $green;
        border: 1px solid darken($green, 10%);
        color: $white;

        &:hover {
          background-color: darken($green, 5%);
        }

        &:active {
          background-color: darken($green, 15%);
        }
      }
    }
  }
}
</style>
