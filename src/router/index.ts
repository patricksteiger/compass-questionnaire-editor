import { createRouter, createWebHistory } from "vue-router";

import { Screen, store } from "../store";

import EditorScreen from "../views/EditorScreen.vue";
import ImportScreen from "../views/ImportScreen.vue";

export const EDITOR_PATH = "/";
export const EDITOR_NAME = "EditorScreen";
export const IMPORT_PATH = "/import";
export const IMPORT_NAME = "Import";

const routes = [
  {
    path: EDITOR_PATH,
    name: EDITOR_NAME,
    component: EditorScreen,
  },
  {
    path: IMPORT_PATH,
    name: IMPORT_NAME,
    component: ImportScreen,
  },
] as const;

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const currentScreen: Screen = store.getters.getCurrentScreen;
  if (!from.name && to.name === EDITOR_NAME && currentScreen !== "editor") {
    next({ name: IMPORT_NAME });
  } else {
    next();
  }
});
export default router;
