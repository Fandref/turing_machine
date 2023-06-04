<template>
    <div class="tape">
        <input class="cell" type="text" 
        v-for="(cell, index) in cellsValue" 
        :key="index"
        :value="cell" 
        @keypress.exact="setCellValue($event, index)"
        @keyup.delete="deleteCellValue($event, index)"
        @dblclick="setActiveCell(index)"
        maxlength="1"/>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
    export default {
        watch:{
            currentCell:{
                handler(currentCell, oldCurrentCell){
                    this.renderActiveCell(oldCurrentCell);
                    this.saveCurrentCellToLocalStorage();
                }
                
            },
            cellsValue:{
                handler(cellsValue){
                    this.saveTapeToLocalStorage();
                },
                deep: true
            },
        },
        computed:{
            cellsValue(){
                return this.$store.state.tape;
            },
            currentCell:{
                get(){
                    return this.$store.state.currentCell;
                },
                set(value){
                    this.$store.commit('setCurrentCell', value);
                }
            }
        },
        methods: {
            ...mapActions({
                loadTapeFromLocalStorage: 'loadTapeFromLocalStorage',
                saveTapeToLocalStorage: 'saveTapeToLocalStorage',
                saveCurrentCellToLocalStorage: 'saveCurrentCellToLocalStorage',
                loadCurrentCellFromLocalStorage: 'loadCurrentCellFromLocalStorage'
            }),
            renderActiveCell (oldCurrentCell = null){
                const cellsSelector = document.querySelectorAll(`.tape .cell`);
                const activeCell = cellsSelector[this.currentCell];
                if(activeCell){
                    activeCell.classList.add('active');
                    activeCell.focus();
                }
                
                if (oldCurrentCell){
                    cellsSelector[oldCurrentCell].classList.remove('active')
                }
            },
            focusCell(index){
                const cellForFocus = document.querySelector(`.tape .cell:nth-child(${index})`);

                if(cellForFocus){
                    cellForFocus.focus();
                }
            },
            setActiveCell (cellIndex){
                this.currentCell = cellIndex;
            },
            setCellValue(e, index){

                this.$store.commit('setTapeCell', {
                    cellValue: e.key,
                    index
                });

                this.focusCell(index+2);                
            },
            deleteCellValue(e, index){
                e.target.value = " ";
                this.$store.commit('setTapeCell', {
                    cellValue: e.target.value,
                    index
                });
                
                this.focusCell(index);
            }
        },
        beforeMount(){
            this.loadTapeFromLocalStorage();
        },
        mounted(){
            this.renderActiveCell();
            this.loadCurrentCellFromLocalStorage();
        }
    }
</script>

<style lang="scss" scoped>
    .tape{
        display: flex;
        padding-bottom: 15px;
        overflow: auto;
        align-items: center;
        height: 4.5em;
    }
    .cell{
        font-size: 2em;
        height: 1.5em;
        width: 1.5em;
        text-align: center;
        line-height: 1.5em;
        transition: all .5s ease;
        &:focus{
            border: 2px solid;
            outline: none;
        }
    }
    .active{
        background: $accent-color;
        border: 2px solid;
        outline: none;
        font-size: 2.5em;
    }
</style>