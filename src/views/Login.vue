<template>
  <div class="login">
    <h1>P-Word</h1>
    <label>
      User Name:
      <input type="text" id="uname" v-model="username" />

      <span class="error" v-if="usernameError">
        {{ usernameError }}
      </span>
    </label>

    <label>
      Password:

      <span class="group">
        <input :type="passwordType" @keyup="resetErrors" v-model="password" />

        <a class="password-toggle" role="button" @click="togglePassword">
          <svg class="password-toggle-icon" viewBox="0 0 32 32"
               v-if="passwordType === 'password'">
            <path d="M16 6c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16
            10s13.027-4.064 16-10c-2.972-5.936-9.021-10-16-10zM23.889
            11.303c1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79
            3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889
            2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697
            1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154
            0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418
            3.582 8 8 8s8-3.582 8-8c0-0.962-0.17-1.883-0.482-2.737 0.124
            0.074 0.248 0.15 0.371 0.228v0zM16 13c0 1.657-1.343 3-3
            3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
          </svg>

          <svg class="password-toggle-icon" viewBox="0 0 32 32"
               v-if="passwordType === 'text'">
            <path d="M29.561 0.439c-0.586-0.586-1.535-0.586-2.121 0l-6.318
            6.318c-1.623-0.492-3.342-0.757-5.122-0.757-6.979 0-13.028
            4.064-16 10 1.285 2.566 3.145 4.782 5.407 6.472l-4.968
            4.968c-0.586 0.586-0.586 1.535 0 2.121 0.293 0.293 0.677
            0.439 1.061 0.439s0.768-0.146 1.061-0.439l27-27c0.586-0.586
            0.586-1.536 0-2.121zM13 10c1.32 0 2.44 0.853 2.841
            2.037l-3.804 3.804c-1.184-0.401-2.037-1.521-2.037-2.841
            0-1.657 1.343-3 3-3zM3.441 16c1.197-1.891 2.79-3.498
            4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311
            0.854-0.482 1.776-0.482 2.737 0 1.715 0.54 3.304 1.459
            4.607l-1.904 1.904c-1.639-1.151-3.038-2.621-4.114-4.323z"></path>
            <path d="M24 13.813c0-0.849-0.133-1.667-0.378-2.434l-10.056
            10.056c0.768 0.245 1.586 0.378 2.435 0.378 4.418 0
            8-3.582 8-8z"></path>
            <path d="M25.938 9.062l-2.168 2.168c0.040 0.025 0.079 0.049 0.118
            0.074 1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79
            3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303-1.208
            0-2.403-0.149-3.561-0.439l-2.403 2.403c1.866 0.671 3.873
            1.036 5.964 1.036 6.978 0 13.027-4.064
            16-10-1.407-2.81-3.504-5.2-6.062-6.938z"></path>
          </svg>
        </a>
      </span>

      <span class="error" v-if="passwordError">
       {{ passwordError }}
      </span>
    </label>

    <transition name="fade">
      <label v-if="isSignUp">
        Verify Password:

        <span class="group">
          <input :type="passwordVerifyType" @keyup="resetErrors"
                 v-model="verifyPassword" />

          <a class="password-toggle" role="button"
             @click="togglePasswordVerify">
            <svg class="password-toggle-icon" viewBox="0 0 32 32"
                 v-if="passwordVerifyType === 'password'">
              <path d="M16 6c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16
              10s13.027-4.064 16-10c-2.972-5.936-9.021-10-16-10zM23.889
              11.303c1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79
              3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889
              2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697
              1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154
              0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418
              3.582 8 8 8s8-3.582 8-8c0-0.962-0.17-1.883-0.482-2.737 0.124
              0.074 0.248 0.15 0.371 0.228v0zM16 13c0 1.657-1.343 3-3
              3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
            </svg>

            <svg class="password-toggle-icon" viewBox="0 0 32 32"
                 v-if="passwordVerifyType === 'text'">
              <path d="M29.561 0.439c-0.586-0.586-1.535-0.586-2.121 0l-6.318
              6.318c-1.623-0.492-3.342-0.757-5.122-0.757-6.979 0-13.028
              4.064-16 10 1.285 2.566 3.145 4.782 5.407 6.472l-4.968
              4.968c-0.586 0.586-0.586 1.535 0 2.121 0.293 0.293 0.677
              0.439 1.061 0.439s0.768-0.146 1.061-0.439l27-27c0.586-0.586
              0.586-1.536 0-2.121zM13 10c1.32 0 2.44 0.853 2.841
              2.037l-3.804 3.804c-1.184-0.401-2.037-1.521-2.037-2.841
              0-1.657 1.343-3 3-3zM3.441 16c1.197-1.891 2.79-3.498
              4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311
              0.854-0.482 1.776-0.482 2.737 0 1.715 0.54 3.304 1.459
              4.607l-1.904 1.904c-1.639-1.151-3.038-2.621-4.114-4.323z"></path>
              <path d="M24 13.813c0-0.849-0.133-1.667-0.378-2.434l-10.056
              10.056c0.768 0.245 1.586 0.378 2.435 0.378 4.418 0
              8-3.582 8-8z"></path>
              <path d="M25.938 9.062l-2.168 2.168c0.040 0.025 0.079 0.049 0.118
              0.074 1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79
              3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303-1.208
              0-2.403-0.149-3.561-0.439l-2.403 2.403c1.866 0.671 3.873
              1.036 5.964 1.036 6.978 0 13.027-4.064
              16-10-1.407-2.81-3.504-5.2-6.062-6.938z"></path>
            </svg>
          </a>
        </span>

        <span class="error" v-if="verifyError">
          Verification password does not match original password.
        </span>
      </label>
    </transition>

    <button @click="signIn" v-if="!isSignUp">
      Sign In
    </button>

    <a role="button" @click="signUp" :class="{ active: isSignUp }">
      Sign Up
    </a>

    <a role="button" @click="resetErrors(); isSignUp = false" v-if="isSignUp">
      Cancel
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  mounted: () => {
    const el = document.getElementById('uname');

    if (el) {
      el.focus();
    }
  },
})
export default class Login extends Vue {
  public username = '';
  public password = '';
  public verifyPassword = '';

  public isSignUp = false;
  public usernameError: string | null = null;
  public verifyError = false;
  public passwordError: string | null = null;

  public passwordType = 'password';
  public passwordVerifyType = 'password';

  private http = (this as any).$http;

  public async signIn() {
    if (!this.validateSignIn()) {
      return;
    }

    const {data} = await this.http.post('signin', {
      username: this.username,
      password: this.password,
    });

    console.log(data); // tslint:disable-line
    if (data.status !== 'success') {
      this.passwordError = data.alerts[0];
      return;
    }

    this.$router.push('home');
  }

  public async signUp() {
    this.resetErrors();

    if (!this.isSignUp) {
      this.isSignUp = true;
      this.passwordVerifyType = 'password';
      this.verifyPassword = '';

      return;
    }

    if (!this.validateSignUp()) {
      return;
    }

    const res = await this.http.post('signup', {
      username: this.username,
      password: this.password,
      verify: this.verifyPassword,
    });

    if (res.data.status === 'error') {
      this.usernameError = res.data.alerts[0];
      this.isSignUp = false;

      return;
    }
  }

  public togglePassword() {
    this.passwordType = this.passwordType === 'text'
      ? 'password'
      : 'text';
  }

  public togglePasswordVerify() {
    this.passwordVerifyType = this.passwordVerifyType === 'text'
      ? 'password'
      : 'text';
  }

  public resetErrors() {
    this.usernameError = null;
    this.passwordError = null;
    this.verifyError = false;
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
    margin: 0 0 3rem;
  }

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    overflow: hidden;
    text-align: left;

    .group {
      position: relative;

      a {
        border: none;
        margin: auto;
        padding: 0;
      }

      input {
        padding-right: 26px;
        width: 100%;
      }

      .password-toggle-icon {
        height: 18px;
        fill: $purple;
        position: absolute;
        right: 4px;
        top: 4px;
        width: 18px;
      }
    }

    input {
      border: 1px solid $purple;
      border-radius: 3px;
      padding: 5px 5px 2px;
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

    &:hover {
      background-color: darken($purple, 5%);
    }
  }

  a {
    border: 1px solid $green;
    border-radius: 3px;
    color: $green;
    cursor: pointer;
    margin-top: 1rem;
    padding: .5rem 0;
    transition: all .3s ease;

    &:hover {
      background-color: darken($white, 2%);
    }

    &.active {
      background-color: $green;
      border: 1px solid darken($green, 10%);
      color: $white;

      &:hover {
        background-color: darken($green, 5%);
      }
    }
  }
}
</style>

