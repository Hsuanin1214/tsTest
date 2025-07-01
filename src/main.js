import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
// import { localize, setLocale } from '@vee-validate/i18n';
import * as AllRules from '@vee-validate/rules';
import { setLocale } from '@vee-validate/i18n';
// import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'; // 引入多國語系
import customRules from './rules/customRulesValidate'; // 引入自訂規則

import App from './App.vue';
import router from './router';

Object.keys(AllRules).forEach(rule => {
  if (typeof AllRules[rule] === 'function') {
    defineRule(rule, AllRules[rule]);
  }
});
// 註冊自訂規則
Object.keys(customRules).forEach(rule => {
  defineRule(rule, customRules[rule]);
});

configure({
  // veevalidate 預設錯誤訊息，generateMessage: localize({ zh_TW: zhTW }),
  // 以下為自訂錯誤訊息
  generateMessage: ({ rule }) => {
    // console.log(rule);
    const customMessages = {
      required: '此欄位為必填',
      email: '請輸入正確的 Email 格式',
      min: `長度不足，至少需${rule.params}位`,
      max: '長度過長',
      passwordComplexity: import.meta.env.VITE_VALIDATE_PWD_MSG,
      confirmed: import.meta.env.VITE_VALIDATE_PWD_CONFIRM_MSG
    };
    return customMessages[rule.name];
  },
  validateOnInput: false
});
setLocale('zh_TW'); // 因為語系檔沒辦法直接啟用，因此會強制預設語系為中文

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app');
