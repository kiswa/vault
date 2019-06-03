<template>
<div class="add">
  <h2 v-if="!isEdit">Add to your vault</h2>

  <h2 v-if="isEdit">Edit credentials</h2>

  <div class="form">
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
  .form {
    display: flex;
    flex-direction: column;
    padding: 1rem;

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

