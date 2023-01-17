import { createRouter, createWebHistory } from "vue-router";

import store from "../store";

import EditorScreen from "../views/EditorScreen.vue";
import ImportScreen from "../views/ImportScreen.vue";

const routes = [
  {
    path: "/",
    name: "EditorScreen",
    component: EditorScreen,
  },
  {
    path: "/import",
    name: "Import",
    component: ImportScreen,
  },
] as const;

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.name !== "Import" && !store.getters.getNameofQuestionnaire) {
    next({ name: "Import" });
  } else {
    next();
  }
});
export default router;
