import { createApp } from 'vue';
import App from './App.vue';
import directives from './directives';
import store from './store';

const app = createApp(App);

directives.forEach(directive => {
    app.directive(directive.name, directive);
});

app.use(store).mount('#app');
