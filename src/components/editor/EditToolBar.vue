<template>
    <div class="edit-tools-container">
        <ul class="editor-toolbar">
            <li @click="togglePromblemsBar">
                Проблеми
                <span class="problem-counter" v-if='problemsCount'>{{problemsCount}}</span>
            </li>
        </ul>
        <div class="edit-tools">
            <div class="problems" :class="problemBarClasses" v-if="problemsCount">
                <problem v-for="problem in problems" :key='problem.line' :line="problem.line" :problem="problem.problem"/>
            </div>
            <div class="problems" :class="problemBarClasses" v-else>
                <p class="no-problem">На даний момент проблем немає</p>
            </div>
        </div>
    </div>
</template>

<script>
import Problem from './Problem.vue';

export default {
    name: "EditToolBar",
    components: {Problem},
    props: {
        problems: {
            type: Array,
            required: true
        }
    },
    data(){
        return {
            isProblemOpened: false
        };
    },
    computed:{
        problemBarClasses(){
            return {
                hidden: !this.isProblemOpened
            }
        },
        problemsCount(){
            if(this.problems){
                const problemsCount = this.problems.length
                return problemsCount > 0 ? problemsCount : null;
            }
                
            return null;
        }
    },
    methods: {
        togglePromblemsBar(){
            this.isProblemOpened = !this.isProblemOpened;
        },
    }
}
</script>

<style lang="scss" scoped>
    .editor-toolbar{
        display: flex;
        padding: 0 8px;
        li{
            padding: 8px;
            cursor: pointer;
            opacity: .8;
            &:hover{
                opacity: 1;
            }
        }
        .problem-counter{
            font-size: 0.9em;
            height: 1em;
            width: 1em;
            padding: 2px;
            border: 2px solid $danger-color;
            border-radius: 50%;
            display: inline-flex;
            align-content: center;
            justify-content: center;
            line-height: 1;
            color: $danger-color;
            font-weight: bold;
        }
    }
</style>