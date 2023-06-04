<template>
  <button class="main-button" :disabled="disabled">
      <slot></slot>
  </button>
</template>

<script>
export default {
    props:{
        disabled:{
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
    .main-button{
        padding: 10px 16px;
        outline: $dark;
        color: $invers-main-color;
        background: $main-color;
        transition: all .3s ease;
        border: 2px solid $main-color;
        &:disabled{
            pointer-events: none;
            background: lighten($main-color, 10%);
        }
        &:hover{
            background: $accent-color;
            color: $main-color;
            border: 2px solid $accent-color;
        }
        
    }
</style>