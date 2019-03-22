<template>
<div>
  <input :type="passwordType" :value="value" @keyup="$emit('keyup', $event)"
         @input="$emit('input', $event.target.value)" />

  <a class="password-toggle" role="button" @click="togglePassword">
    <img svg-inline src="../../public/eye.svg" alt="Show Password" title="Show Password"
         class="password-toggle-icon"
         v-if="passwordType === 'password'">

    <img svg-inline src="../../public/eye-line.svg" alt="Hide Password" title="Hide Password"
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

  private eb = (this as any).$eventBus;

  public mounted() {
    this.eb.$on('reset-password-toggle', () => {
      this.passwordType = 'password';
    });
  }

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
    color: $purple;
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

