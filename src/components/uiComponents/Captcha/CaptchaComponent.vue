<script setup>
import { ref } from 'vue';
// import { useAxiosMethod } from '@/composables/axios/useAxios-v1';
// import { useAlert } from '@/composables/alertMethod';
import ValidateInput from '@/components/validate/ValidateInput.vue';
import { SpeakerWaveIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';

// const { useAxios } = useAxiosMethod();
// 接收 props
const props = defineProps({
  errors: Object
});
// const { showAlert } = useAlert();
// const newDate = ref(new Date().getTime());
// const urls = computed(() => {
//   // 因newDate 變動時urls也要跟著變動，使用compute
//   return {
//     captcha: `/SystemInfos/generate-captcha?timestamp=${newDate.value}`,
//     audio: '/SystemInfos/get-captcha-audio',
//     img: '/SystemInfos/get-captcha-image'
//   };
// });
const config = ref({
  img: {
    param: {
      responseType: 'arraybuffer'
    },
    captchaImageUrl: '',
    type: 'image/png'
  },
  audio: {
    param: {
      responseType: 'blob'
    },
    audioUrl: '',
    type: 'audio/wav'
  }
});
// 使用 defineModel 定義與父層的雙向綁定
const captchaCode = defineModel('captchaCode', { required: true });
// const captchaId = defineModel('captchaId', { required: true });

/** 下載驗證碼
 * @param {String} url - 取得語音或圖檔的API
 * @param {String} id - API對照的captchaId
 * @param {Object} param - header responseType
 * @param {String} type - 回傳轉換的格式
 */
// const downLoadImgAndAudio = async (url, id, param, type) => {
// let srcUrl = '';
// try {
//   const imageResponse = await useAxios(`${url}/${id}`, 'get', undefined, param, 'DOWNLOAD');
//   if (imageResponse.data.value) {
//     const blob = new Blob([imageResponse.data.value.data], {
//       type
//     });
//     srcUrl = window.URL.createObjectURL(blob); // 將 Blob 轉為 URL
//   }
//   return srcUrl; // 將 URL 儲存到 ref 中
// } catch (error) {
//   console.error('Error fetching user details:', error);
//   showAlert('資料有誤，請聯繫管理員', 'error', 'toastHasCloseAlert');
//   return null;
// }
// };
/** 取得圖形驗證CaptchaID */
// const generateCaptcha = async () => {
//   try {
//     const { data } = await useAxios(urls.value.captcha, 'get');
//     captchaId.value = data.value.captchaId;
//     config.value.img.captchaImageUrl = await downLoadImgAndAudio(
//       urls.value.img,
//       data.value.captchaId,
//       config.value.img.param,
//       config.value.img.type
//     );
//     config.value.audio.audioUrl = await downLoadImgAndAudio(
//       urls.value.audio,
//       data.value.captchaId,
//       config.value.audio.param,
//       config.value.audio.type
//     );
//   } catch (error) {
//     console.dir(error);
//     showAlert('資料有誤，請聯繫管理員', 'error', 'toastHasCloseAlert');
//   }
// };

// /** 使用 Audio 元素播放音頻 */
// const loadAudio = () => {
//   if (config.value.audio.audioUrl) {
//     const audio = new Audio(config.value.audio.audioUrl);
//     audio.play().catch(error => {
//       console.error('Audio playback failed:', error);
//       showAlert('語音有誤，請聯繫管理員', 'error', 'toastHasCloseAlert');
//     });
//   }
// };
// /** 重整按鈕需重抓timestamp */
// const getNewStamp = async () => {
//   newDate.value = new Date().getTime();
//   await generateCaptcha();
// };

// onMounted(() => {
//   generateCaptcha();
// });
</script>
<template>
  <div>
    <div class="mb-1 flex items-center text-start">
      <label for="captcha" class="me-1 text-lg font-bold text-gray-500">圖形驗證碼</label>
    </div>
    <div class="mb-5 space-x-2 sm:flex sm:items-center sm:justify-center">
      <div class="mb-5 flex h-[60px] min-h-[60px] items-center justify-center sm:mb-0">
        <!-- <img
          :src="config.img.captchaImageUrl"
          alt="驗證碼圖片"
          v-if="config.img.captchaImageUrl"
          class="h-auto max-w-full"
        /> -->
        <div class="h-11 w-50 max-w-full content-center rounded border border-gray-300 text-center text-gray-400">
          驗證碼圖
        </div>
      </div>
      <button class="btn btn-sm btn-warning sm:px-2 md:px-3" title="語音服務 按鈕" @click.prevent="loadAudio">
        <SpeakerWaveIcon class="size-5">
          <audio :src="config.audio.audioUrl" hidden>
            <source type="audio/wav" />
          </audio>
        </SpeakerWaveIcon>
      </button>
      <button
        class="btn btn-sm btn-secondary cursor-pointer sm:px-2 md:px-3"
        @click.prevent="getNewStamp"
        title="重新產生驗證碼 按鈕"
      >
        <ArrowPathIcon class="size-5"></ArrowPathIcon>
      </button>
    </div>
    <div class="relative h-[68px]">
      <ValidateInput
        id="captcha"
        name="圖形驗證碼"
        type="text"
        placeholder="請輸入圖形驗證碼"
        rules="required"
        :errors="props.errors || {}"
        class="input-hover-bg bg-gray-200 ps-9"
        v-model="captchaCode"
        title="請輸入圖形驗證碼"
      />
    </div>
  </div>
</template>
