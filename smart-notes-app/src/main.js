/**
 * @fileoverview Entry point untuk aplikasi Vue.js
 * @description File utama yang menginisialisasi dan mount aplikasi Vue ke DOM
 * @module main
 */

import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

/**
 * Membuat instance Vue app dan mount ke elemen dengan id "app"
 * @description Menginisialisasi aplikasi Vue dengan komponen App sebagai root component
 */
createApp(App).mount("#app");
