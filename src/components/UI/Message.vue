<template>
    <transition name="show-message">
        <div class="message" :class="messageType" v-if="show">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
export default {
    props:{
        messageType:{
            type: String,
            default: 'info',
            validator(messageType){
                const messageTypes = [
                    'success',
                    'info',
                    'error'
                ];

                return messageTypes.includes(messageType);
            }
        },
        autoHideMs:{
            type:Number
        },
        show:{
            type: Boolean
        }
    },
    watch:{
        show:{
            handler(value){
                if(this.autoHideMs){
                    setTimeout(this.autoHide, this.autoHideMs)
                }
            },
            immediate: true
        }
    },
    methods:{
        autoHide(){
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.message{
    border-top: 1px solid $dark;
    padding: 20px 30px;
    background: $gray-lighter;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 3;
    &.success{
        background: $accent-color;
    }
    &.error{
        background: $danger-color;
    }
}

.show-message-enter-active {
  transition: all .7s ease;
}
.show-message-leave-active {
  transition: all .7s ease;
}
.show-message-enter{
  transform: translateY(-100%);
  opacity: 0;
}
.show-message-leave-to{
  transform: translateY(100%);
  opacity: 0;
}
</style>