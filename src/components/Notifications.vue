<template>
  <div id="notifications-container">
    <div v-for="note in notifications" :key="note.message" :class="note.type">
      {{ note.message }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Notification } from '@/models/notification';

@Component({})
export default class Notifications extends Vue {
  private eb = (this as any).$eventBus;
  private notifications: Notification[] = [];

  public created() {
    this.eb.$on('notify', (data: Notification) => {
      this.notifications.push(data);

      setTimeout(() => {
        this.removeNotification(data);
      }, 3000);
    });
  }

  private removeNotification(item: Notification) {
    const index = this.notifications.findIndex((note) => note === item);

    this.notifications.splice(index);
  }
}
</script>

<style lang="scss" scoped>
</style>
