<template>
  <div class="login">
    <h1>P-Word</h1>
    <label>
      User Name:
      <input type="text" v-model="username" />
    </label>

    <label>
      Password:
      <input type="password" v-model="password" />
    </label>

    <button @click="signIn">Sign In</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Login extends Vue {
  public username = '';
  public password = '';

  public signIn(): void {
    console.log(this.username, this.password);
  }
}
</script>

<style lang="scss">
@import '../variables';

.login {
  border-radius: 5px;
  box-shadow: 1px 1px 15px 0 rgba($grey, .5);
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
  padding: 2rem;
  width: 20rem;

  h1 {
    margin: 0 0 3rem;
  }

  label {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;

    input {
      border: 1px solid $purple;
      border-radius: 3px;
      max-width: 60%;
      outline: none;
      padding: 3px 5px;
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
}
</style>

