<template>
  <div id="notifications-container" v-if="notifications.length">
    <transition-group name="collapse">
      <div v-for="note in notifications" :key="note.message"
           class="note" :class="note.type" @click="removeNotification(note)">
        <header v-if="note.title && note.title.length > 0">
          {{ note.title }}
        </header>

        <div v-if="note.message.length > 0">{{ note.message }}</div>
      </div>
    </transition-group>
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
      }, 2000);
    });
  }

  private removeNotification(item: Notification) {
    const index = this.notifications.findIndex((note) => note === item);

    this.notifications.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
@import '../variables';

#notifications-container {
  align-items: center;
  border-radius: 50%;
  display:  flex;
  flex-direction: column;
  left: 0;
  max-height: 23rem;
  overflow: auto;
  padding: 2rem;
  position: fixed;
  right: -20px;
  top: 0;

  .collapse-enter-active,
  .collapse-leave-active {
    transition: all .2s ease-out;
  }

  .collapse-enter,
  .collapse-leave-to {
    opacity: 0;
    transform: rotateX(90deg);
  }

  .collapse-enter-to,
  .collapse-leave {
    opacity: 1;
    transform: rotateX(0deg);
  }

}

.note {
  background-color: rgba($white, .9);
  border: 1px solid lighten($black, 30%);
  border-radius: 3px;
  box-shadow: 0 12px 15px 0 rgba(0, 0, 0, .22),
              0 17px 20px 0 rgba(0, 0, 0, .12);
  cursor: pointer;
  margin-bottom: .5rem;
  max-width: 100%;
  text-align: left;
  width: 30rem;

  header {
    border-bottom: 1px solid lighten($black, 30%);
    font-weight: 700;
    padding: 1rem 1rem .5rem;
  }

  div {
    padding: 1rem;
  }

  &.error {
    background-color: rgba(lighten($error, 30%), .9);
    border-color: $error;

    header {
      background-color: lighten($error, 25%);
      border-color: $error;
      color: darken($error, 10%);
    }
  }

  &.warning {
    background-color: rgba(lighten($warning, 30%), .9);
    border-color: $warning;

    header {
      background-color: lighten($warning, 25%);
      border-color: $warning;
      color: darken($warning, 15%);
    }
  }

  &.success {
    background-color: rgba(lighten($success, 30%), .9);
    border-color: $success;

    header {
      background-color: lighten($success, 25%);
      border-color: $success;
      color: darken($success, 15%);
    }
  }

  &.info {
    background-color: rgba(lighten($info, 30%), .9);
    border-color: $info;

    header {
      background-color: lighten($info, 20%);
      border-color: $info;
      color: darken($info, 15%);
    }
  }
}
</style>
