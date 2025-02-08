import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import enhanceApp from "../enhanceApp";
import "./css/mainColor.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp,
} satisfies Theme;
