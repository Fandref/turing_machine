
import { createStore } from 'vuex';
import example from '../config/example';
import { defaultState, currentCell, showTimeoutMessage } from '../config/settings';

export default createStore({
  state: {
    tape: null,
    savedTape: [],
    code: '',
    commands: null,
    currentState: defaultState,
    defaultState: defaultState,
    problemLength: 0,
    currentCell: currentCell,
    textMessage: '',
    currentLaunchLine: null,
    showMessage: false,
    messageType: 'info',
    autoHideMsMessage: showTimeoutMessage
  },
  mutations: {
    setCurrentLaunchLine(state, currentLaunchLine) {
      if (currentLaunchLine > 0) {
        state.currentLaunchLine = currentLaunchLine;
      }
    },
    setDefaultState(state, defaultState) {
      state.defaultState = parseInt(defaultState, 10);
    },
    setTextMessage(state, textMessage) {
      state.textMessage = textMessage;
    },
    setMessageType(state, messageType) {
      state.messageType = messageType;
    },
    setShowMessage(state, showMessage) {
      state.showMessage = showMessage;
    },
    setAutoHideMsMessage(state, autoHideMs) {
      state.autoHideMsMessage = autoHideMs;
    },
    setTape(state, tape) {
      state.tape = tape;
    },
    setTapeCell(state, { cellValue, index }) {
      if (cellValue.length > 0 && index){
        state.tape[index] = cellValue;
      }
    },
    setCode(state, code) {
      state.code = code;
    },
    setCurrentState(state, currentState) {
      state.currentState = parseInt(currentState, 10);
    },
    setCommands(state, commands) {
      state.commands = commands;
    },
    setProblemLength(state, length) {
      state.problemLength = length;
    },
    setSavedTape(state, savedTape) {
      state.savedTape = savedTape
    },
    setCurrentCell(state, cellIndex) {
      state.currentCell = parseInt(cellIndex, 10);
    }
  },
  actions: {
    loadExample({ commit }) {
      const data = example;
      commit('setTape', data.tape);
      commit('setDefaultState', data.defaultState);
      commit('setCurrentState', data.defaultState);
      commit('setCode', data.code);
    },
    eraseFields({ commit }) {
      commit('setTape', Array(100));
      commit('setDefaultState', 1);
      commit('setCurrentState', 1);
      commit('setCode', '');
    },
    saveTapeToLocalStorage({ state }) {
      localStorage.setItem('tape', JSON.stringify(state.tape));
    },
    loadTapeFromLocalStorage({ commit }) {
      const tape = localStorage.getItem('tape');

      if (tape){
        commit('setTape', JSON.parse(tape));
      }
      else{
        commit('setTape', Array(100));
      }
    },
    saveSavedTapeToLocalStorage({ state }) {
      localStorage.setItem('savedTape', JSON.stringify(state.savedTape));
    },
    loadSavedTapeFromLocalStorage({ commit }) {
      const tape = localStorage.getItem('savedTape');

      if (tape){
        commit('setSavedTape', JSON.parse(tape));
      }
    },

    saveCodeToLocalStorage({ state }) {
      localStorage.setItem('code', state.code);
    },
    loadCodeFromLocalStorage({ commit }) {
      const code = localStorage.getItem('code');

      if (code){
        commit('setCode', code);
      }
    },
    saveDefaulStateToLocalStorage({ state }) {
      localStorage.setItem('defaultState', state.defaultState);
    },
    loadDefaulStateFromLocalStorage({ commit }) {
      let defaultState = localStorage.getItem('defaultState');

      if (defaultState) {
        defaultState = parseInt(defaultState);
        commit('setDefaultState', defaultState);
        commit('setCurrentState', defaultState);
      }

    },
    saveCurrentCellToLocalStorage({ state }) {
      localStorage.setItem('currentCell', state.currentCell);
    },
    loadCurrentCellFromLocalStorage({ commit }) {
      let currentCell = localStorage.getItem('currentCell');

      if (currentCell) {
        currentCell = parseInt(currentCell);
        commit('setCurrentCell', currentCell);
      }
    }
  },
});
