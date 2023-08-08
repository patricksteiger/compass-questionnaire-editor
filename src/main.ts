import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { store } from "./store";
import { Quasar, Loading, Notify } from "quasar";
import { i18n } from "./i18n";

createApp(App)
  .use(i18n)
  .use(Quasar, {
    plugins: {
      Loading,
      Notify,
    },
  })
  .use(store)
  .use(router)
  .mount("#app");
