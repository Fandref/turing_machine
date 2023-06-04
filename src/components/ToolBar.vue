<template>
  <div class="tool-bar">
      <second-button @click="saveTape" :disabled="isRun">Зберегти стрічку</second-button>
      <second-button @click="eraseTape" :disabled="isRun">Очистити стрічку</second-button>
      <second-button :disabled='!isSavedTape || isRun' @click='restorationTape'>Відновити стрічку</second-button>
      <div class="speed-panel">
          <label for="speed">швидкість</label>
          <input-range
          id="speed"
          :min="speedSettings.min"
          :max="speedSettings.max"
          :step="speedSettings.step"
          v-model="speed"/>
          <span class="speed-value">{{speedSecond}}</span>
      </div>
      <custom-input 
      class="input-state" 
      placeholder="Номер стану" 
      type="number" 
      label="Початковий стан" 
      :disabled="isRun" 
      v-model="defaultState" />
      <second-button @click='step' :disabled="isRun">Крок</second-button>
      <main-button @click="toogleMachine">{{runButtonText}}</main-button>      
  </div>
</template>

<script>
import CustomInput from './UI/CustomInput.vue';
import InputRange from './UI/InputRange.vue';

import MainButton from './UI/MainButton.vue';
import SecondButton from './UI/SecondButton.vue';

import {spaceMark, endState, speedSettings} from '../config/settings';

export default {
  components: { MainButton, SecondButton, InputRange, CustomInput },
  data(){
    return {
        speedSettings: speedSettings,
        speed: speedSettings.default,
        isRun: false,
        runedChannel: null,
    }
  },
  computed:{
    textMessage:{
      get(){
        return this.$store.state.textMessage;
      },
      set(textMessage){
        this.$store.commit('setTextMessage', textMessage)
      }
    },
    isSavedTape(){
        const savedTape = this.$store.state.savedTape;
        return savedTape && savedTape.length > 0;
    },
    currentCell:{
      get(){
        return this.$store.state.currentCell;
      },
      set(currentCell){
        this.$store.commit('setCurrentCell', currentCell)
      }
    },
    defaultState:{
        get(){
            return this.$store.state.defaultState;
        },
        set(defaultState){
            this.$store.commit('setDefaultState', defaultState);
            
        }
    },
    tapeIsEmpty(){
        return this.$store.state.tape.filter(cell=>typeof cell !== 'undefined').length === 0;
    },
    showMessage:{
      get(){
        return this.$store.state.showMessage;
      },
      set(showMessage){
        this.$store.commit('setShowMessage', showMessage);
      }
    },
    autoHideMs:{
      get(){
        return this.$store.state.autoHideMsMessage;
      },
      set(autoHideMsMessage){
        this.$store.commit('setAutoHideMsMessage', autoHideMsMessage);
      }
    },
    commands(){
        return this.$store.state.commands;
    },
    speedSecond(){
        return this.speed/1000+' c'
    },
    runButtonText(){
        return this.isRun ? 'Стоп' : 'Старт';
    },
    currentState:{
        get(){
            return this.$store.state.currentState;
        },
        set(state){
            this.$store.commit('setCurrentState', state);
        }
    },
    messageType:{
      get(){
        return this.$store.state.messageType;
      },
      set(messageType){
        this.$store.commit('setMessageType', messageType);
      }
    }
  },
  watch:{
    isRun(value){
        if(value){
            this.runedChannel = setInterval(this.step, this.speed);
        }
        else if(!value && this.runedChannel){
            clearInterval(this.runedChannel);
            this.runedChannel = null;
        }
    },
    defaultState(state){
        this.$store.dispatch('saveDefaulStateToLocalStorage');
    }
  },
  methods:{
      step(){
          let currentValue = this.$store.state.tape[this.currentCell];
          currentValue = currentValue === ' ' || typeof currentValue === 'undefined' || !currentValue ? spaceMark : currentValue;

          if(this.commands.hasOwnProperty(currentValue) && this.commands[currentValue].hasOwnProperty(this.currentState)){
            const command = this.commands[currentValue][this.currentState];
            this.$store.commit('setCurrentLaunchLine', command.line);
            this.$store.commit('setTapeCell', {
                cellValue: command.replaceTo,
                index: this.currentCell
            })

            if(command.swichStateTo === endState){
                this.currentState = this.defaultState;
                this.isRun = false;
                this.textMessage = 'Роботу завершено успішно! Машину повернуто в початковий стан';
                this.messageType = 'success';
                this.showMessage = true;

            }
            else
                this.currentState = command.swichStateTo;

            this.currentCell = this.currentCell + command.caretDirection;
          }
          else{
            this.currentState = this.defaultState;
            this.isRun = false;
            this.textMessage = `Символ "${currentValue}" не описаний в ${this.currentState} стані`;
            this.messageType = 'error';
            this.showMessage = true;
          }
          

      },
      saveTape(){
          this.$store.commit('setSavedTape', this.$store.state.tape);
          this.$store.dispatch('saveTapeToLocalStorage');
          this.$store.dispatch('saveSavedTapeToLocalStorage');
      },
      eraseTape(){
          this.$store.commit('setTape', Array(100));
      },
      restorationTape(){
          this.$store.commit('setTape', this.$store.state.savedTape);
      },
      toogleMachine(){
          if(Object.keys(this.commands).length > 0){
              if(this.$store.state.problemLength === 0){
                  if(this.currentState > 0){
                    this.isRun = !this.isRun;
                    this.step();
                }
                else{
                    this.messageType = 'error';
                    this.textMessage = 'Стан повинен бути більше нуля';
                    this.showMessage = true;
                }
              }
              else{
                this.messageType = 'error';
                this.textMessage = 'Виправіть помилки коду';
                this.showMessage = true;
              }

          }
          else{
              this.messageType = 'error';
              this.textMessage = 'Для початку напишіть код';
              this.showMessage = true;
          }
          
      }
  },
  beforeMount(){
    this.$store.dispatch('loadDefaulStateFromLocalStorage');
    this.$store.dispatch('loadSavedTapeFromLocalStorage');
    
  }

}
</script>

<style lang="scss" scoped>
.tool-bar{
    margin: 40px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 20px;
    .speed-panel{
        label{
            margin-right: 10px;
        }
        .speed-value{
            margin-left: 4px;
            display: inline-block;
            width: 35px;
        }
    }
    .input-state{
        input{
            width: 60px;
        }
    }
}
</style>