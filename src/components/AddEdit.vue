<template>
<div class="add">
  <h2 v-if="!isEdit" @click="toggleOpen">
    Add to your vault
    <img src="../../public/angle-down.svg" :class="{ 'is-open': isOpen }" />
  </h2>

  <h2 v-if="isEdit" @click="toggleOpen">
    Edit credentials
  </h2>

  <div class="form" :class="{ 'is-open': isOpen || isEdit }">
    <label>
      Product Name:
      <input type="text" class="partial" v-model="value.product"
             @input="emitInput('update:product', $event)" />
    </label>

    <label>
      Category:
      <input type="text" class="partial" v-model="value.category"
             @input="emitInput('update:category', $event)" />
    </label>

    <label>
      Username:
      <input type="text" class="partial" v-model="value.name"
             @input="emitInput('update:name', $event)" />
    </label>

    <label class="group">
      Password:
      <password-toggle class="partial" v-model="value.password"
                       @input="emitInput('update:password', $event)">
      </password-toggle>
    </label>

    <div>
      <button @click="$emit('submit')">
        {{ isEdit ? 'Save' : 'Add' }}
      </button>

      <button @click="cancelEdit" v-if="isEdit" class="cancel">
        Cancel
      </button>
    </div>

  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import PasswordToggle from '@/components/PasswordToggle.vue';

@Component({
  components: {
    PasswordToggle,
  },

  props: [
    'value',
    'isEdit',
  ],
})
export default class AddEdit extends Vue {
  private eb = (this as any).$eventBus;

  private isOpen = false;

  private toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  private emitInput(eventType: string, event: Event) {
    if (event && event.target) {
      this.$emit(eventType, (event.target as any).value);
    }
  }

  private cancelEdit() {
    this.eb.$emit('cancel-edit');
  }
}
</script>

<style lang="scss" scoped>
@import '../variables';

.add {
  h2 {
    align-items: center;
    display: flex;
    justify-content: space-between;

    img {
      height: 1.2rem;
      transition: transform .2s ease;
      width: 1.2rem;

      &.is-open {
        transform: rotate(180deg);
      }

      @media (min-width: $breakpoint-tablet + 1) {
        display: none;
      }
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    @media (max-width: $breakpoint-tablet) {
      height: 0;
      overflow: hidden;
      padding: 0;
      transition: all .2s ease-in-out;

      &.is-open {
        height: auto;
        padding: 1rem;
      }
    }

    label {
      align-items: center;
      display: flex;
      height: 28px;
      justify-content: space-between;
      margin-bottom: 1rem;

      .partial {
        width: 60%;
      }
    }

    button {
      margin-right: 1rem;

      &.cancel {
        background-color: $white;
        color: $purple;

        &:hover {
          background-color: darken($white, 3%);
        }
      }
    }
  }
}
</style>

