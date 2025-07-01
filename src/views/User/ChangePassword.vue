<script setup>
import { ref } from 'vue';
// import { useAxiosMethod } from '@/composables/axios/useAxios-v1';
import { useRouter } from 'vue-router';
// import { userStore } from '@/stores/userStore';
import ValidateInput from '@/components/validate/ValidateInput.vue';
import PasswordTooltip from '@/components/uiComponents/Tooltip/BaseTooltip.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
import { useAlertStore } from '@/stores/Alert/alertStore';

// const isMustChangePassword = localStorage.getItem('mustChangePassword') === 'true';
// const userId = localStorage.getItem('userId');
// const url = ref('/Users/change-password');
const router = useRouter();
// const useUserStore = userStore();
// const { useAxios } = useAxiosMethod();

/** 驗證訊息 */
const validatePwdMsg = import.meta.env.VITE_VALIDATE_PWD_MSG;

const userChange = ref({
  changePassWordRequest: {
    // userId,
    password: '',
    newPassword: '',
    confirmPassword: ''
  }
});
// 提示訊息
const alertStore = useAlertStore();

const submitChangePassword = async userValue => {
  // try {
  //   const { data } = await useAxios(url.value, 'post', userValue);

  //   if (data.value.success) {
  // showAlert(`${data.value.messages}`, 'success');
  alertStore.trigger({
    type: 'success',
    // message: `${data.value.messages}`,
    message: '密碼已更新，請重新登入',
    duration: 3000,
    showButton: false
  });
  //     // useUserStore.logout(router);
  //     useUserStore.userLogout(router);
  router.push('/');
  //   } else {
  //     showAlert(`${data.value.messages}`, 'error', 'toastHasCloseAlert');
  //   }
  // } catch (error) {
  //   console.error(error.message);
  //   showAlert('密碼驗證有誤，請重新輸入', 'error', 'toastHasCloseAlert');
  // }
  console.log(userValue);
};

const handleCancel = () => {
  // if (isMustChangePassword) {
  //   // useUserStore.logout(router);
  //   useUserStore.userLogout(router);
  // } else {
  //   router.push('/personInformation');
  // }
  router.push('/personInformation');
  console.log('取消');
};
</script>
<template>
  <div>
    <div>
      <div class="flex min-h-[95vh] items-center justify-center">
        <div class="relative mb-5 flex w-11/12 items-center justify-center gap-8">
          <div
            class="mb-8 max-h-full min-h-full w-full rounded-md bg-white py-10 text-center shadow-xl md:mb-0 md:min-h-[60vh] md:w-8/12 md:py-12 xl:w-5/12"
          >
            <div>
              <h2 class="text-secondary-600 mb-10 px-6 text-2xl font-bold md:px-10">更改密碼</h2>
              <div class="relative h-full px-4 md:h-[36vh] md:px-8">
                <VForm v-slot="{ errors }" class="flex flex-col" @submit="submitChangePassword(userChange)">
                  <div>
                    <div>
                      <div class="mb-1 text-start">
                        <label
                          for="oldPassword"
                          class="text-lg font-bold text-gray-500 before:text-red-500 before:content-['*']"
                          >舊密碼</label
                        >
                      </div>
                      <div class="relative mb-4 h-[68px]">
                        <ValidateInput
                          id="oldPassword"
                          name="舊密碼"
                          type="text"
                          placeholder="請輸入舊密碼"
                          rules="required"
                          :errors="errors"
                          class="bg-gray-200 ps-5"
                          v-model="userChange.changePassWordRequest.password"
                          :showImage="true"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="mb-1 flex items-center text-start">
                        <label
                          for="newChangePassword"
                          class="text-lg font-bold text-gray-500 before:text-red-500 before:content-['*']"
                          >新密碼</label
                        >
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
                            mobile-position="bottom"
                            bg-class="bg-gray-700"
                            text-class="text-white"
                          >
                            {{ validatePwdMsg }}
                          </PasswordTooltip>
                        </button>
                      </div>
                      <div class="relative mb-4 h-[68px]">
                        <ValidateInput
                          id="newChangePassword"
                          name="重設密碼"
                          type="text"
                          placeholder="請輸入新密碼"
                          rules="required|passwordComplexity|differentFromPassword:帳號"
                          :errors="errors"
                          class="bg-gray-200 ps-5"
                          v-model="userChange.changePassWordRequest.newPassword"
                          :showImage="true"
                        />
                      </div>
                    </div>

                    <div>
                      <div class="mb-1 text-start">
                        <label
                          for="newChangePasswordConfirm"
                          class="text-lg font-bold text-gray-500 before:text-red-500 before:content-['*']"
                          >確認新密碼</label
                        >
                      </div>
                      <div class="relative h-[68px]">
                        <ValidateInput
                          id="newChangePasswordConfirm"
                          name="確認新密碼"
                          type="text"
                          placeholder="請再次輸入新密碼"
                          rules="required|confirmed:重設密碼"
                          :errors="errors"
                          class="bg-gray-200 ps-5"
                          v-model="userChange.changePassWordRequest.confirmPassword"
                          :showImage="true"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    :class="{
                      'cursor-not-allowed': Object.keys(errors).length > 0
                    }"
                  >
                    <div class="mt-8 flex items-center justify-center gap-4">
                      <button type="submit" class="btn btn-primary w-1/2">送出</button>

                      <button type="button" class="btn btn-secondary w-1/2" @click="handleCancel">取消</button>
                    </div>
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
