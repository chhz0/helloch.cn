import type { Theme } from "vitepress"
import  DefaultTheme  from "vitepress/theme"
import Layout from "./Layout.vue"
import './custom.css'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('MyGlobalComponent', {
            template: '<div>This is a global component</div>'
        })
    }
} satisfies Theme