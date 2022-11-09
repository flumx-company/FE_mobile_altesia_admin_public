<template>
  <div
    class="modal-wrapper"
    :class="{ active: true }"
    @click.self="$emit('close')"
  >
    <div
      class="modal-window"
      :style="{ width, maxHeight: height,  height: '80%' }"
    >
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="main-text">
        <slot name="main-text"></slot>
      </div>
      <div class="form-block">
        <slot name="create-form-opportunity"></slot>
        <slot name="create-form-event"></slot>
        <slot name="create-form-category"></slot>
      </div>
      <div class="rating">
        <slot name="rating"></slot>
      </div>

      <div class="btn-block">
        <div class="black-btn">
          <slot name="back"></slot>
        </div>
        <div class="green-btn">
          <slot name="delete"></slot>
        </div>
        <div class="green-btn">
          <slot name="push-event"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'modal',
  props: {
    width: {
      type: String,
      default: '318px'
    },
    height: {
      type: String,
      default: 'auto'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/_colors.scss';
@import '../assets/styles/_mixins.scss';
@import '../assets/styles/_modal-window.scss';

</style>
