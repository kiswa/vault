<template>
  <div class="login">
    <h1>P-Word</h1>
    <label>
      User Name:
      <input type="text" v-model="username" />

      <span class="error" v-if="usernameError">
        {{ usernameError }}
      </span>
    </label>

    <label>
      Password:
      <input type="password" @keyup="resetErrors"
        v-model="password" />

      <span class="error" v-if="passwordError">
        Password must be at least 12 characters long.
      </span>
    </label>

    <label v-if="isSignUp">
      Verify Password:
      <input type="password" @keyup="resetErrors"
        v-model="verifyPassword" />

      <span class="error" v-if="verifyError">
        Verification password does not match original password.
      </span>
    </label>

    <button @click="signIn" v-if="!isSignUp">Sign In</button>

    <a @click="signUp" :class="{ active: isSignUp }">Sign Up</a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Login extends Vue {
  public username = '';
  public password = '';
  public verifyPassword = '';

  public isSignUp = false;
  public usernameError = null;
  public verifyError = false;
  public passwordError = false;

  private http = (this as any).$http;

  public async signIn() {
    const res = await this.http.post('login', {
      username: this.username,
      password: this.password,
    });

    console.log(res.data); //tslint:disable-line
  }

  public async signUp() {
    if (!this.isSignUp) {
      this.isSignUp = true;
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

  public resetErrors() {
    this.usernameError = null;
    this.passwordError = false;
    this.verifyError = false;
  }

  private validateSignUp() {
    let noErrors = true;

    if (this.password !== this.verifyPassword) {
      this.verifyError = true;
      noErrors = false;
    }

    if (this.password.length < 12) {
      this.passwordError = true;
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

  h1 {
    margin: 0 0 3rem;
  }

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    text-align: left;

    input {
      border: 1px solid $purple;
      border-radius: 3px;
      outline: none;
      padding: 3px 5px;
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

