import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primevue/resources/themes/aura-light-purple/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/main.css'

import { createApp } from 'vue';
import ConfirmationService from 'primevue/confirmationservice';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ConfirmationService);
app.use(createPinia())
app.use(router);
app.use(PrimeVue);

app.mount('#app')

