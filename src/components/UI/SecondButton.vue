<template>
  <button class="second-button" :disabled="disabled">
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

<style lang='scss' scoped>
    .second-button{
        padding: 10px 16px;
        outline: $dark;
        color: $dark;
        background: transparent;
        border: 2px solid $dark;
        box-sizing: border-box;
        transition: all .3s ease;
        &:disabled{
            cursor: not-allowed;
            opacity: .6;
        }
        &:not(:disabled):hover{
            background: $accent-color;
            color: $main-color;
        }
        
    }

</style>