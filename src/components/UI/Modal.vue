<template>
    <div class="modal-container" v-if="openModal">
        <div class="overlay" @click="close()"></div>
        <div class="modal-window">
            <div class="modal-head">
                <h2 class="modal-title">
                    {{title}}
                </h2>
                <button-light class="button-close-modal" @click="close()">_</button-light>
                
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
            <div class="modal-footer">

            </div>
        </div>
    </div>
</template>

<script>
import ButtonLight from './ButtonLight.vue'
    export default {
  components: { ButtonLight },
        name: 'Modal',
        props: {
            title: {
                type: String,
                default: "Title"
            }
        },
        data(){
            return {
                openModal: false                
            }
        },
        methods:{
            open(){
                this.openModal = true;
                document.body.style.overflow = 'hidden';
            },
            close(){
                this.openModal = false
                this.$emit('close');
                document.body.style.overflow = 'auto';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-container{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 990;
        padding: $padding;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    .overlay{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: $overlay-dark;
        backdrop-filter: blur(3px);
        cursor: pointer;

    }
    .modal-window{
        background: #fff;
        padding: $padding;
        line-height: 1.5;
        min-width: 50%;
        max-width: 60%;
        min-height: 50%;
        max-height: 80%;

    }
    .modal-head{
        margin-bottom: $padding;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .button-close-modal{
        font-size: $font-size-h2;
        line-height: 0.3;
    }
</style>