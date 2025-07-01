<script setup>
import { ref } from 'vue';
// import { useAxiosMethod } from '@/composables/axios/useAxios-v1';
// import { useRouter } from 'vue-router';
// import { useAlert } from '@/composables/alertMethod';
// import { userStore } from '@/stores/userStore';
import ValidateInput from '@/components/validate/ValidateInput.vue';

// const url = ref('/Users/forgot-password');
// const { useAxios } = useAxiosMethod();
// const { showAlert } = useAlert();

const userForget = ref({
  // userName: '',
  email: ''
});

const submitForgetPassword = async userValue => {
  console.log(userValue);
  // try {
  // 	const { data } = await useAxios(url.value, 'post', userValue);
  // 	if (data.value.success) {
  // 		showAlert(
  // 			'已將重新設定帳密寄至您的信箱',
  // 			'success',
  // 			'toastHasCloseAlert',
  // 		);
  // 		localStorage.setItem('username', userValue.userName);
  // 	} else {
  // 		showAlert(`${data.value.messages}`, 'error', 'toastHasCloseAlert');
  // 	}
  // } catch (error) {
  // 	console.dir(error);
  // 	showAlert('資料有誤，請聯繫管理員', 'error', 'toastHasCloseAlert');
  // }
};
// const useUserStore = userStore();
// const router = useRouter();
// const logout = () => {
//   useUserStore.userLogout(router);
// };
</script>
<template>
  <div>
    <div class="container">
      <div class="flex min-h-[95vh] items-center justify-center">
        <div class="relative mb-5 flex w-11/12 items-center justify-center gap-8">
          <div
            class="mb-8 max-h-full min-h-full w-full rounded-md bg-white py-10 text-center shadow-xl sm:mb-0 sm:max-h-[55vh] sm:min-h-[55vh] sm:w-1/2 sm:py-12 xl:w-5/12"
          >
            <div>
              <h2 class="text-eiadoc-txtcolor mb-10 px-6 text-2xl font-bold sm:px-10">忘記密碼</h2>
              <div class="relative h-full px-4 sm:h-[36vh] sm:px-8">
                <VForm
                  v-slot="{ errors }"
                  class="flex h-full flex-col justify-between"
                  @submit="submitForgetPassword(userForget)"
                >
                  <div>
                    <div class="">
                      <div class="mb-1 text-start">
                        <label
                          for="forgetAccount"
                          class="text-lg font-bold text-gray-500 before:text-red-500 before:content-['*']"
                          >帳號</label
                        >
                      </div>
                      <div class="relative mb-4 h-[68px]">
                        <ValidateInput
                          id="forgetAccount"
                          name="帳號"
                          type="text"
                          placeholder="請輸入帳號"
                          rules="required|email"
                          :errors="errors"
                          class="bg-gray-200 ps-5"
                          v-model="userForget.email"
                          title="請輸入帳號"
                        />
                      </div>
                    </div>

                    <!-- <div>
                      <div class="mb-1 text-start">
                        <label
                          for="loginPassword"
                          class="text-lg font-bold text-gray-500 before:text-red-500 before:content-['*']"
                          >信箱</label
                        >
                      </div>
                      <div class="relative h-[68px]">
                        <ValidateInput
                          id="forgetEmail"
                          name="忘記信箱"
                          type="text"
                          placeholder="請輸入信箱"
                          rules="required|email"
                          :errors="errors"
                          class="bg-gray-200 ps-5"
                          v-model="userForget.email"
                          title="請輸入信箱"
                        />
                      </div>
                    </div> -->
                  </div>
                  <div
                    :class="{
                      'cursor-not-allowed': Object.keys(errors).length > 0
                    }"
                  >
                    <div class="flex items-center justify-center gap-4">
                      <button type="submit" class="btn btn-primary w-1/2">送出</button>
                      <router-link type="button" class="btn btn-secondary w-1/2" to="/" title="前往 首頁"
                        >取消</router-link
                      >
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
