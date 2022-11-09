import { createApp } from 'vue'
import App from './App.vue'
import { router } from "./router";
import { createLoader } from "../packages/altesia-loading-worker";

createLoader();

createApp(App)
    .use(router)
    .mount('#app');


