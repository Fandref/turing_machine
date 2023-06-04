<template>
  <header>
    <h1>Turing machine</h1>
    <nav>
      <ul class="tool-menu">
        <li>
          <drop-down-menu label="Файл">
            <drop-down-menu-item-button>
              <span v-modal="'modalSaveFile'">Зберегти</span>
            </drop-down-menu-item-button>
            <drop-down-menu-item-button>
              <div class="file-input">
                <label for="load-file">Завантажити</label>
                <input type="file" id="load-file" @change="loadFile" accept=".tm" hidden>
              </div>
            </drop-down-menu-item-button>
          </drop-down-menu>
        </li>
        <li>
          <drop-down-menu label="Поля">
            <drop-down-menu-item-button @click="loadExample">
              Завантажити приклад
            </drop-down-menu-item-button>
            <drop-down-menu-item-button @click="eraseFields">
              Очистити всі
            </drop-down-menu-item-button>
          </drop-down-menu>
        </li>
      </ul>
      <button-light class="manual-open-button" v-modal="'modalI'">Інструкція</button-light>


    </nav>
    <modal ref="modalSaveFile" title="Збереження файлу" style="text-align: center">
      <div style="margin-bottom: 20px">
        <div>Назва файлу</div>
        <custom-input v-model="filename" />
      </div>
      <main-button @click='saveFile'>Зберегти</main-button>
    </modal>
    <modal ref="modalI" title="Інструкція">
      <p>
        Команди мають формат: <br> <b>Пошуковий символ</b><span>Пошуковий стан(число)</span><span
          title="Знак переходу">></span><b>Новий символ</b><span>Новий стан(число або END)</span><i>Напрямок каретки (R -
          вправо, L - вліво, H - на місці)</i><br>
        Також можна залишати коментарі починаючи їх з //
      </p>
      <h3 class="ex-head">Приклад:</h3>
      <pre class="ex-code">//коментар<br>r12>e23R // коментар<br>e23>eENDH
      </pre>
    </modal>
  </header>
  <div class="application-container">
    <tape />
    <tool-bar />
    <editor class="editor-container" @update="getCommands"></editor>
  </div>
  <message v-model:show="showMessage" :message-type="messageType" :auto-hide-ms="autoHideMs">{{ textMessage }}</message>
</template>
<script>
import DropDownMenu from '@/components/UI/DropDown/DropDownMenu.vue';
import DropDownMenuItemButton from '@/components/UI/DropDown/DropDownMenuItemButton.vue';
import ButtonLight from '@/components/UI/ButtonLight.vue';
import Modal from '@/components/UI/Modal.vue';
import Editor from '@/components/editor/Editor.vue';
import Tape from '@/components/tape/Tape.vue';
import ToolBar from './components/ToolBar.vue';
import Message from './components/UI/Message.vue';
import CustomInput from './components/UI/CustomInput.vue';
import MainButton from './components/UI/MainButton.vue';
import { mapActions } from 'vuex';

export default {
  components: { DropDownMenu, DropDownMenuItemButton, ButtonLight, Modal, Editor, Tape, ToolBar, Message, CustomInput, MainButton },
  data() {
    return {
      isShowManual: false,
      commands: {},
      currentCell: 49,
      speed: 500,
      filename: 'untitled',
    }
  },
  computed: {
    textMessage: {
      get() {
        return this.$store.state.textMessage;
      },
      set(textMessage) {
        this.$store.commit('setTextMessage', textMessage)
      }
    },
    showMessage: {
      get() {
        return this.$store.state.showMessage;
      },
      set(showMessage) {
        this.$store.commit('setShowMessage', showMessage);
      }
    },
    autoHideMs: {
      get() {
        return this.$store.state.autoHideMsMessage;
      },
      set(autoHideMsMessage) {
        this.$store.commit('setAutoHideMsMessage', autoHideMsMessage);
      }
    },
    messageType: {
      get() {
        return this.$store.state.messageType;
      },
      set(messageType) {
        this.$store.commit('setMessageType', messageType);
      }
    }
  },
  methods: {
    ...mapActions({
      loadExample: 'loadExample',
      eraseFields: 'eraseFields'
    }),
    getCommands(commands) {
      this.commands = commands;
    },
    loadSaveData(data) {
      this.$store.commit('setSavedTape', data.savedTape);
      this.$store.commit('setTape', data.tape);
      this.$store.commit('setDefaultState', data.defaultState);
      this.$store.commit('setCurrentState', data.defaultState);
      this.$store.commit('setCode', data.code);
      this.$store.commit('setCurrentCell', data.currentCell);
    },
    loadFile(e) {
      try {
        let file = e.target.files.item(0);
        let reader = new FileReader();
        let file_data;
        let handler = this.loadSaveData;
        reader.onload = function () {
          file_data = reader.result;
          handler(JSON.parse(file_data));
        }

        if (file){
          reader.readAsText(file);
        }
      } catch (error) {
        tmCompileError("Помилка завантаження файлу");
      }
    },
    formatToSave() {
      const savedTape = this.$store.state.savedTape;
      const tape = this.$store.state.tape;
      const defaultState = this.$store.state.defaultState;
      const code = this.$store.state.code;
      const currentCell = this.$store.state.currentCell;
      const dataForSave = {
        savedTape,
        tape,
        defaultState,
        code,
        currentCell
      }

      return JSON.stringify(dataForSave);
    },
    saveFile() {
      let element = document.createElement('a'),
        tm_data = this.formatToSave(),
        filename = this.filename + '.tm';
      
      if (tm_data) {
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tm_data));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        this.$refs.modalSaveFile.close();
        this.filename = '';
      }

    }
  },
  mounted() {
    document.title = "Turing Maсhine";
  }
}
</script>

<style lang="scss">
#app {
  font-family: $font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $main-color;

}

header {
  border-bottom: 1px solid $gray-light;
}

nav {
  display: flex;
  justify-content: space-between;
}

h1 {
  margin: $padding-m 0;
  padding: 0 $padding-m;
}

.tool-menu {
  display: flex;
  align-items: center;
}

.manual-open-button {
  padding: 0 15px;
}

.application-container {
  margin-top: 25px;
  padding: 0px 15px;
}

.editor-container {
  margin-top: 20px;
}

.ex-head {
  margin-bottom: 5px;
}

.ex-code {
  margin-top: 5px;
  font-size: 1.2em;
}

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }</style>
