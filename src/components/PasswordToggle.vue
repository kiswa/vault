<template>
<div>
  <input :type="passwordType" :value="value" @keyup="$emit('keyup', $event)"
         @input="$emit('input', $event.target.value)" />

  <a class="password-toggle" role="button" @click="togglePassword">
    <img src="eye.svg" alt="toggle password"
         class="password-toggle-icon"
         v-if="passwordType === 'password'">

    <img src="eye-line.svg" alt="toggle password"
         class="password-toggle-icon"
         v-if="passwordType === 'text'">
  </a>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: [
    'value',
  ],
})
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
@import '../variables';

div {
  position: relative;

  input {
    padding-right: 26px;
    width: 100%;
  }

  a {
    border: none;
    margin: auto;
    padding: 0;
  }

  .password-toggle-icon {
    cursor: pointer;
    height: 18px;
    fill: $purple;
    position: absolute;
    right: 4px;
    top: 4px;
    width: 18px;
  }
}
</style>

