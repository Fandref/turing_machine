<template>
    <input class="range-input" 
    type="range" 
    :min="min" 
    :max="max" 
    :step="step" 
    :value="modelValue"
    @input="updateValue" />
</template>

<script>
export default {
    props:{
        min:{
            type: Number,
            required: true,
        },
        max:{
            type: Number,
            required: true,
        },
        step:{
            type: Number,
            required: false   
        },
        modelValue: {
            type: Number
        }
    },
    methods:{
        updateValue(event) {
            this.$emit('update:modelValue', event.target.value);
        }
    }
}
</script>

<style lang="scss" scoped>
    input[type=range] {
    -webkit-appearance: none;
    margin: 10px 0;
    }
    input[type=range]:focus {
    outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    background: lighten($accent-color, 20%);
    transition: background .3s ease;
    border-radius: 0px;
    border: 0px solid #000101;
    }
    input[type=range]:hover::-webkit-slider-runnable-track {
    background: $accent-color;
    }
    input[type=range]::-webkit-slider-thumb {
    border: 0px solid #000000;
    height: 20px;
    width: 20px;
    // border-radius: 20px;
    background: $main-color;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -3.6px;
    }
    // input[type=range]:focus::-webkit-slider-runnable-track {
    // background: darken($accent-color, 5%);
    // }
</style>