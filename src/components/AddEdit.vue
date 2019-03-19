<template>
<div class="add">
  <h2>Add to your vault</h2>

  <div class="form">
    <label>
      Product Name:
      <input type="text" />
    </label>

    <label>
      Category:
      <input type="text" />
    </label>

    <label>
      Username:
      <input type="text" />
    </label>

    <label class="group">
      Password:
      <input :type="addPasswordType" />

      <a class="password-toggle" role="button" @click="toggleAddPassword">
        <img src="eye.svg" alt="toggle password"
             class="password-toggle-icon"
             v-if="addPasswordType === 'password'">

        <img src="eye-line.svg" alt="toggle password"
             class="password-toggle-icon"
             v-if="addPasswordType === 'text'">
      </a>
    </label>

    <button>Add</button>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class AddEdit extends Vue {
  public addPasswordType = 'password';

  public toggleAddPassword() {
    this.addPasswordType = this.addPasswordType === 'text'
      ? 'password'
      : 'text';
  }
}
</script>

<style lang="scss" scoped>
@import '../variables';

.add {
  .form {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    label {
      align-items: baseline;
      display: flex;
      height: 28px;
      justify-content: space-between;
      margin-bottom: 1rem;

      &.group {
        position: relative;

        input {
          padding-right: 26px;
          position: absolute;
          right: 0;
        }
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
  }
}
</style>

