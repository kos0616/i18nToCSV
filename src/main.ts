import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";

createApp(App).mount("#app");

declare global {
  export type typeMode = "transform" | "merge";
}
