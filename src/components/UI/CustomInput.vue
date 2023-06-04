<template>
    <label class="custom-input-label" v-if="label">
        {{label}}
        <input class="custom-input"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        @input="updateValue" />

    </label>
    <input class="custom-input"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        @input="updateValue" v-else />
</template>

<script>
export default {
    props:{
        modelValue:{
            type: [String, Number]
        },
        placeholder:{
            type: String
        },
        label:{
            type: String
        },
        type:{
            type: String,
            default: 'text',
            validator(value){
                const types = [
                    'text',
                    'number',
                    'password'
                ]
                return types.includes(value);
            }
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
.custom-input{
    padding: 8px;
    font-size: inherit;
    border: 2px solid $gray-darker;
    transition: border-color .3s ease;
    &:focus{
        border-color: $dark;
    }
}
</style>