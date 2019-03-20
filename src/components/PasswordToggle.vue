<template>
<div>
  <input :type="passwordType" />

  <a class="password-toggle" role="button" @click="toggleAddPassword">
    <img src="eye.svg" alt="toggle password"
         class="password-toggle-icon"
         v-if="addPasswordType === 'password'">

    <img src="eye-line.svg" alt="toggle password"
         class="password-toggle-icon"
         v-if="addPasswordType === 'text'">
  </a>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class PasswordToggle extends Vue {
  public passwordType = 'password';

  public togglePassword() {
    this.passwordType = this.passwordType === 'text'
      ? 'password'
      : 'text';
  }
}
</script>

<style lang="scss" scoped>
</style>

