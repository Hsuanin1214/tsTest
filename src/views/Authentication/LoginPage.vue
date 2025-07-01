<script setup>
import { ref, onMounted } from 'vue';
// import { useAxiosMethod } from '@/composables/axios/useAxios-v1';
import { useRouter } from 'vue-router';
// import { useCookie } from '@/composables/cookie/useCookie';
import { useAlertStore } from '@/stores/Alert/alertStore';

import ValidateInput from '@/components/validate/ValidateInput.vue';
import PasswordTooltip from '@/components/uiComponents/Tooltip/BaseTooltip.vue';
import CaptchaComponent from '@/components/uiComponents/Captcha/CaptchaComponent.vue';
import ValidateButton from '@/components/validate/ValidateButton.vue';
import AccessibilityGuild from '@/components/uiComponents/AccessibilityGuild/AccessibilityGuild.vue';
import { LockClosedIcon, UserIcon } from '@heroicons/vue/24/solid';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
// const { useAxios } = useAxiosMethod();
const alertStore = useAlertStore();
// const url = {
//   login: '/Users/login'
// };
const isLoading = ref(false); // 新增isLoading變量控制loading圖示

const user = ref({
  mail: '',
  password: ''
  // captchaId: '',
  // captchaCode: ''
});

/** 驗證訊息 */
const validatePwdMsg = import.meta.env.VITE_VALIDATE_PWD_MSG;

const title = ref(import.meta.env.VITE_APP_TITLE);

// const pinNumber = ref('');
/** 是否為手機作業系統 (iso 或 android) */
const isMobileOS = ref(false);

/** 判斷是否為平板或手機，平板或手機需隱藏自然人憑證登入 */
const checkUserDevice = () => {
  // android 比較難正確判斷，android 有可能會顯示 null 或 linux
  const hidePinBlockDevice = ['iphone', 'ipad', 'android', 'linux', 'null'];
  const operatingSystem = navigator.platform.toLowerCase();
  hidePinBlockDevice.forEach(device => {
    if (operatingSystem.includes(device)) {
      isMobileOS.value = true;
    }
  });
};

/** 設定cookie期限 */
// const { setCookie, removeCookie } = useCookie();

// // 管理路由跳轉
const handleRouteNavigation = userDetails => {
  console.log(userDetails);
  // const { mustResetPassword } = userDetails;
  /** 舊帳號 */
  // if (mustResetPassword) {
  //   showAlert('因您的帳號為舊帳號，填完忘記密碼後，將會寄信讓您重設密碼。', 'warning', 'toastHasCloseAlert');
  //   removeCookie('jwt');
  //   localStorage.removeItem('userId');
  //   return router.push('/forgetPassword');
  // }
  // showAlert('登入成功', 'success');

  alertStore.trigger({
    type: 'success',
    message: '登入成功',
    duration: 3000,
    showButton: false
  });
  return router.push('/homePage');
};
const submitLogin = async userValue => {
  isLoading.value = true;
  console.log(userValue);
  // try {
  // const { data } = await useAxios(url.login, 'post', userValue);
  // const {
  //   token,
  //   userId,
  //   isApproved,
  //   cityCode,
  //   isMoenv,
  //   serviceAgency,
  //   mustResetPassword,
  //   mustChangePassword,
  //   functionGroups
  // } = data.value;
  /** 登入成功 */
  // if (data.value.operationResult.success) {
  // setCookie('jwt', token, 2);
  // localStorage.setItem('userId', userId);
  // localStorage.setItem('isApproved', isApproved);
  // localStorage.setItem('cityCode', cityCode);
  // localStorage.setItem('isMoenv', isMoenv);
  // localStorage.setItem('serviceAgency', serviceAgency);
  // localStorage.setItem('mustResetPassword', mustResetPassword);
  // sessionStorage.setItem('functionGroups', JSON.stringify(functionGroups));
  // showAlert('登入成功', 'success');
  // handleRouteNavigation(data.value);
  handleRouteNavigation();
  // } else {
  //   showAlert(`${data.value.operationResult.messages[0]}`, 'warning', 'toastHasCloseAlert');
  //   /** 帳密錯誤或三次被鎖定 */
  //   if (data.value.lockoutEnabled) {
  //     router.push('/');
  //     return;
  //   }
  //   /** 未審核帳號 */
  //   if (!data.value.isApproved) {
  //     setCookie('jwt', token, 2);
  //     sessionStorage.setItem('functionGroups', JSON.stringify(functionGroups));
  //     localStorage.setItem('userId', userId);
  //     localStorage.setItem('isApproved', isApproved);
  //     router.push('/ReRegisterView');
  //     return;
  //   }
  //   /** 停用帳號 */
  //   if (isApproved && !data.value.isActive) {
  //     router.push('/');
  //     return;
  //   }
  //   /** 超過三個月帳號 */
  //   if (data.value.mustChangePassword) {
  //     setCookie('jwt', token, 2);
  //     localStorage.setItem('mustChangePassword', mustChangePassword);
  //     localStorage.setItem('userId', userId);
  //     localStorage.setItem('isApproved', isApproved);
  //     router.push('/ChangePassword');
  //   }
  // }
  // } catch (error) {
  //   showAlert(`資料有誤，請聯繫管理員:${error}`, 'error', 'toastHasCloseAlert');
  // } finally {
  //   isLoading.value = false;
  // }
};

onMounted(() => {
  checkUserDevice();
});
</script>

<template>
  <div>
    <div class="container">
      <AccessibilityGuild position="center" class="sr-only mb-2 text-white"></AccessibilityGuild>
      <div class="flex min-h-[95vh] flex-col justify-center">
        <div class="mb-10 flex items-center justify-center">
          <!-- <img src="@/assets/image/icon/title_icon.svg" alt="" class="w-10 sm:w-14" width="60" /> -->
          <h2 class="title-white-shadow text-primary-550 ms-3 text-center text-2xl font-semibold sm:text-4xl">
            {{ title }}
          </h2>
        </div>
        <div class="relative mb-5 block items-center justify-center gap-8 sm:flex">
          <div
            class="mb-8 h-auto w-full rounded-md bg-white py-10 text-center shadow-xl sm:mb-0 sm:h-[625px] sm:max-w-96 sm:py-10"
          >
            <div>
              <h3 class="text-secondary-600 mb-10 px-6 text-2xl font-bold sm:px-10">「帳號／密碼」</h3>
              <div class="relative h-auto px-4 sm:h-[480px] sm:px-8">
                <VForm v-slot="{ errors }" class="flex h-full flex-col justify-between" @submit="submitLogin(user)">
                  <div>
                    <div class="">
                      <div class="mb-1 text-start">
                        <label for="loginAccount" class="text-lg font-bold text-gray-500">帳號</label>
                      </div>
                      <div class="relative mb-4 h-[68px]">
                        <UserIcon class="text-primary-500 absolute top-[0.65rem] left-3 z-10 size-6"></UserIcon>
                        <ValidateInput
                          id="loginAccount"
                          name="登入帳號"
                          type="text"
                          placeholder="請輸入帳號"
                          rules="required|email"
                          class="input-hover-bg bg-gray-200 ps-9"
                          v-model="user.mail"
                          title="請輸入帳號"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="mb-1 flex items-center text-start">
                        <label for="loginPassword" class="me-1 text-lg font-bold text-gray-500">密碼</label>
                        <button
                          class="group a11y-focus relative flex cursor-pointer flex-col items-center justify-center text-center"
                          aria-label="密碼規則說明"
                          tabindex="0"
                        >
                          <QuestionMarkCircleIcon
                            class="text-secondary-500 hover:text-secondary-600 size-5 cursor-pointer"
                          />
                          <PasswordTooltip
                            desk-position="top"
                            mobile-position="right"
                            bg-class="bg-gray-700"
                            text-class="text-white"
                          >
                            {{ validatePwdMsg }}
                          </PasswordTooltip>
                        </button>
                      </div>
                      <div class="relative h-[68px]">
                        <LockClosedIcon
                          class="text-primary-500 absolute top-[0.65rem] left-3 z-10 size-6"
                        ></LockClosedIcon>
                        <ValidateInput
                          id="loginPassword"
                          name="登入密碼"
                          type="text"
                          placeholder="請輸入密碼"
                          title="請輸入密碼"
                          rules="required"
                          class="input-hover-bg bg-gray-200 ps-9"
                          :showImage="true"
                          v-model="user.password"
                        />
                      </div>
                    </div>
                    <CaptchaComponent
                      v-model:captchaCode="user.captchaCode"
                      v-model:captchaId="user.captchaId"
                      :errors="errors"
                    ></CaptchaComponent>
                  </div>
                  <ValidateButton
                    type="submit"
                    title="登入"
                    color="primary"
                    :is-loading="isLoading"
                    :errors="errors"
                    class="mb-2 flex w-full items-center justify-center"
                  >
                    登入</ValidateButton
                  >
                  <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <router-link
                      type="button"
                      class="btn btn-outline-primary w-full sm:w-1/2"
                      to="/forgetPassword"
                      title="前往 忘記密碼頁面"
                      >忘記密碼</router-link
                    >
                    <router-link
                      type="button"
                      class="btn btn-outline-primary flex w-full items-center justify-center gap-2 sm:w-1/2"
                      to=""
                      title="前往 Google快速登入頁面"
                    >
                      <img src="@/assets/images/icons/google.svg" alt="" aria-hidden="true" class="h-5 w-5" />
                      <span>Google登入</span>
                    </router-link>
                  </div>
                </VForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.title-white-shadow {
  text-shadow:
    2px 2px white,
    -2px -2px white,
    2px -2px white,
    -2px 2px white;
}
</style>
