<template>
    <div class="editor-contrainer">
        <div class="editor">
            <textarea
            class="editing-area-container"
            ref="editor"
            spellcheck="false"
            @scroll="syncScroll"
            @focus="focusDetect"
            @blur="blurDetect"
            @keyup="hotKeyHandler"
            v-on-selection-change="syncSelection"
            v-model="code"></textarea>
            <div class="selection-line" :style="selectionLinePosition" ref="selectionLine"></div>
            <div class="number-bar" ref="numberBar">
                <div class="line-number" :class="{'focus-line': index === currentLine}" v-for="index in lineCount" :key="index">{{index}}</div>
            </div>
            <div class="code-highlight" v-html="codeHighlighted" ref='codeHighlight'></div>
        </div>
        <edit-tool-bar :problems="problems"></edit-tool-bar>
    </div>
</template>

<script>
    import {codeToCommands, detectProblems, formatHightlight} from '../../utils/editor';
    import sequenceArray from '../../utils/arrayUtils';
    import EditToolBar from './EditToolBar.vue';

    export default {
    components: { EditToolBar},
        name: 'Editor',
        data(){
            return {
                selectionStart: 0,
                selectionEnd: 0,
                scrollTop: 0,
                isFocus: false
            }
        },
        computed:{
            codeHighlighted(){
                if(this.code != ''){
                    return formatHightlight(this.code)
                }
                    
                return '<div class="line"></div>'
            },
            code:{
                get(){
                    return this.$store.state.code;
                },
                set(code){
                    this.$store.commit('setCode', code);
                }
            },
            problems(){
                if(this.code != ''){
                    return detectProblems(this.code);
                }
                return [];
            },
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
            },
            lineCount(){
                if(this.code)
                    return this.code.split('\n').length;
                return 1;
                
            },
            currentLine(){
                if(this.isFocus){
                    const selText = this.code.substring(0, this.selectionStart);
                    return selText.split('\n').length;
                }
                return 0;
                
            },
            currentLaunchLine(){
                return this.$store.state.currentLaunchLine
            },
            selectionLinePosition(){
                let top = '-100px';
                if(this.currentLine>0 && this.selectionStart === this.selectionEnd){
                    const currentLineSelector = document.querySelector(`.code-highlight .line:nth-child(${this.currentLine})`);
                    top = currentLineSelector.offsetTop-this.scrollTop+'px'
                }

                return {top}
            }
        },
        watch:{
            problems(codeProblems){
                this.$store.commit('setProblemLength', codeProblems.length);
                this.dispayProblemsInLine(codeProblems);
            },
            code(code){
                const commands = codeToCommands(code);
                this.$store.commit('setCommands', commands);
                this.$store.dispatch('saveCodeToLocalStorage');
            },
            currentLaunchLine(line){
                const oldLaunchedLine = document.querySelector(`.code-highlight .line.launch`);
                const lineElement = document.querySelector(`.code-highlight .line:nth-child(${line})`);
                if(oldLaunchedLine){
                    oldLaunchedLine.classList.remove('launch');
                }
                if(lineElement){
                    lineElement.classList.add('launch');
                }
            }
        },
        methods:{
            dispayProblemsInLine(problems){
                const alreadyProblemLines = document.querySelectorAll(`.code-highlight .line.problem`);
                alreadyProblemLines.forEach(line=>{line.classList.remove('problem')});
                problems.forEach(problem => {
                    const lineElement = document.querySelector(`.code-highlight .line:nth-child(${problem.line})`);
                    if(lineElement)
                        lineElement.classList.add('problem')
                });

            },
            togglePromblemsBar(){
                this.isProblemOpened = !this.isProblemOpened;
            },
            blurDetect(){
                this.isFocus = false;
            },
            focusDetect(){
                this.isFocus = true;
                const oldLaunchedLine = document.querySelector(`.code-highlight .line.launch`);
                if(oldLaunchedLine){
                    oldLaunchedLine.classList.remove('launch');
                }
            },    
            syncScroll() {
                const editor = this.$refs.editor;
                let result_element = this.$refs.codeHighlight;
                const numberBar = this.$refs.numberBar;
                numberBar.style.transform = `translateY(-${editor.scrollTop}px)`
                this.scrollTop = editor.scrollTop;
                result_element.scrollTop = editor.scrollTop;
                result_element.scrollLeft = editor.scrollLeft;
            },
            getLineByPosition(position){
                const selText = this.code.substring(0, position);
                return selText.split('\n').length;
            },
            detectLineForComment(){
                const editor = this.$refs.editor;
                
                if(editor.selectionStart !== editor.selectionEnd){
                    const startLine = this.getLineByPosition(editor.selectionStart)-1;
                    const endLine = this.getLineByPosition(editor.selectionEnd)-1;
                    return sequenceArray(startLine, endLine)

                }
                else{
                    return [this.currentLine-1];
                }
                
                
            },
            commentLine(){
                const editor = this.$refs.editor;
                const lines = this.code.split('\n');
                const selectionStart = editor.selectionStart;
                const selectionEnd = editor.selectionEnd;
                const linesForComments = this.detectLineForComment();
                const allSelectCommented = linesForComments.every(lineIndex => /\/\/.*/.test(lines[lineIndex]));
                let selectionStartCorrection = 2;
                let selectionEndCorrection = 2;

                if(allSelectCommented){
                    linesForComments.forEach(lineIndex => {lines[lineIndex] = lines[lineIndex].slice(2)});
                }
                else{
                    linesForComments.forEach(lineIndex => {lines[lineIndex] = '//'+lines[lineIndex]});
                }
                if(selectionEnd !== selectionStart){
                    selectionStartCorrection = 0;
                    selectionEndCorrection = 2*(linesForComments.length-1)+2;
                }
                this.code = lines.join('\n')
                editor.value = lines.join('\n');
                
                editor.focus();
                if(allSelectCommented){
                    editor.selectionStart = selectionStart - selectionStartCorrection;
                    editor.selectionEnd = selectionEnd-selectionEndCorrection;
                }
                else{
                    editor.selectionStart = selectionStart + selectionStartCorrection;
                    editor.selectionEnd = selectionEnd+selectionEndCorrection;
                }
            },
            syncSelection(){
                const editor = this.$refs.editor;
                this.selectionStart = editor.selectionStart;
                this.selectionEnd = editor.selectionEnd;
            },
            hotKeyHandler(e){
                if(e.ctrlKey){
                    if(e.which === 191)
                    this.commentLine();

                }
                else if(e.which === 8)
                    this.syncSelection();
            }
        },
        beforeMount(){
            this.$store.dispatch('loadCodeFromLocalStorage');
        },
    }
</script>

<style lang="scss">
    .editor{
        font-family: 'Courier New', Courier, monospace;
        border: 2px $gray-darker solid;
        padding: 15px;
        outline: none;
        overflow: hidden;
        height: 53vh;
        position: relative;
        padding-left: 0px;
        counter-reset: line;
        font-size: 18px;
        line-height: 1.5;
        .selection-line{
            padding: 3px 0;
            position: absolute;
            top: -100px;
            right: 0;
            width: calc(100% - 48px);
            box-sizing: border-box;
            border: 1px solid rgb(177, 177, 177);
            border-right: none;
            border-left: none;
            min-height: 35px;
            &.unselect{
                opacity: 0;
            }
        }
        .number-bar{
            width: 48px;
            
            .line-number{
                opacity: 0.5;
                padding: 4px 10px;
                text-align: right;
                color: rgb(24, 24, 24);
                box-sizing: border-box;
                &.focus-line{
                    opacity: 1;
                }
            }

        }
        .editing-area-container, .code-highlight{
            overflow: auto;
            white-space: nowrap;
            top: 0;
            right: 0;
            padding: inherit;
            padding-left: 0px;
            width: calc(100% - 48px);
            height: 100%;
            position: absolute;
            box-sizing: border-box;
        }
        .editing-area-container{
            font-family: inherit;
            font-size: inherit;
            color: transparent;
            caret-color: black;
            line-height: 35px;
            outline: none;
            border: none;
            
            resize: none;
            background: transparent;
            z-index: 1;
        }
        .code-highlight{
            white-space: nowrap;
            overflow: hidden;
            height: 100%;
            &>.line{
                position: relative;
                padding: 3px 0;
                box-sizing: border-box;
                border: 1px solid transparent;
                border-right: none;
                border-left: none;
                min-height: 35px;
                &.launch{
                    background: $gray-lighter;
                }
                &.problem{
                    text-decoration: underline;
                    text-decoration-color: $danger-color;
                    text-decoration-style: wavy;
                }

            }
        }
    }
    .finded-symbol{
        color: green;     
    }
    .finded-state{
        color: yellowgreen;
    }
    .transition-symbol{
        color: blue;
    }
    .new-symbol{
        color: orangered;
    }
    .new-state{
        color: orange;
    }
    .caret-direction{
        color: purple;
    }
    .comment{
        color: $gray;
    }
    .space{
        border-bottom: 1px solid;
        border-top: 1px solid;
        box-sizing: border-box;
    }
    .edit-tools-container{
        border: 2px $gray-darker solid;
        border-top: none;
        .problems{
            border-top: 2px $gray-darker solid;
            padding: 15px 15px 0px 15px;
            .no-problem{
                margin-top: 0px;
                color: $gray;
                margin-bottom: 15px;
            }
            &.hidden{
                display: none;
            }
        }
    }
</style>