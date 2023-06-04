<template>
    <li class="drop-down-menu-item">
        <button class="drop-down-menu-button">
            <slot></slot>
        </button>
        

        
    </li>
</template>

<script>
    export default {
    }
</script>

<style lang="scss" scoped>
    .drop-down-menu-button{
        padding: $padding-s $padding-m;
        cursor: pointer;
        display: block;
        width: 100%;
        text-align: left;
    }
    .drop-down-menu-button:hover{
        background: $accent-color;
    }

</style>