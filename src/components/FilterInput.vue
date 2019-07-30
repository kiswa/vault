<template>
  <aside id="filter">
    <span @click="toggleInput">
      <img svg-inline src="../../public/filter.svg" />
    </span>

    <div id="filter-container">
      <input v-if="showInput"
             type="text"
             id="filter-input"
             @input="debounceFilter"
             :placeholder="placeholder" />
    </div>
  </aside>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class FilterInput extends Vue {
  private debounceTimeout: number = 0;
  private showInput: boolean = false;

  @Prop({ required: true, default: '' })
  private placeholder!: string;

  @Prop({ required: false, default: 500 })
  private timeout!: number;

  private toggleInput() {
    this.showInput = !this.showInput;

    if (!this.showInput) {
      this.$emit('filter-input', '');
      return;
    }

    setTimeout(() => {
      const el = document.getElementById('filter-input');

      if (el) {
        el.focus();
      }
    }, 250);
  }

  private debounceFilter(event: any) {
    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = setTimeout(() => {
      this.$emit('filter-input', event.target.value);
    }, this.timeout);
  }
}
</script>

<style lang="scss" scoped>
#filter {
  svg {
    width: 12px;
  }

  #filter-container {
    position: absolute;
    left: 0;
    top: -2rem;

    input {
      width: 10rem;
    }
  }
}
</style>

