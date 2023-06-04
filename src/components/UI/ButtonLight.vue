<template>
    <button class="light-button">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .light-button{
        cursor: pointer;
        outline: none;
        border: none;
        background: transparent;
        border-radius: 0;
        font-size: $font-size;
        color: $gray-dark;

        &:hover{
            color: $dark;
        }
    }
</style>