<template>
    <div class="drop-down-menu">
        <div class="drop-down-menu-label">
            {{label}}
        </div>
        <ul class="drop-down-menu-content" >
            <slot></slot>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            label: {
                type: String,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .drop-down-menu{
        .drop-down-menu-label{
        color: $gray-dark;
        padding: $padding-m/2 $padding-m;
        cursor: pointer;
        }
        .drop-down-menu-content{
            background: #fff;
            border: 1px solid $gray-light;
            position: absolute;
            transform: translateY(-30px);
            padding: $padding-s 0;
            display: none;
            opacity: 0;
        }
        &:hover{
            .drop-down-menu-content{
                display: block;
                transform: translateY(0px);
                opacity: 1;
                animation: dropDown 300ms ease-in-out forwards;
            }
            .drop-down-menu-label{
                color: $dark;
            }
        }

        @keyframes dropDown {
            0% {
                opacity: 0;
                transform: translateY(-30px)
            }
            100% {
                opacity: 1;
                transform: translateY(0px)
            }
        }
    }
    
    
</style>