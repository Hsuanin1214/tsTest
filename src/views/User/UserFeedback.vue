/** 系統意見投書(目前畫面被刪除) */
<script setup>
import { ref } from 'vue';
import WhiteContainer from '@/components/uiComponents/WhiteContainer/WhiteContainer.vue';
import PageTitle from '@/components/uiComponents/PageTitle/PageTitle.vue';
import ValidateInput from '@/components/validate/ValidateInput.vue';
import ValidateTextArea from '@/components/validate/ValidateTextArea.vue';
import { useAlertStore } from '@/stores/Alert/alertStore';

const alertStore = useAlertStore();
const submitForm = () => {
  alertStore.trigger({
    type: 'success',
    message: '送出成功，謝謝您寶貴的意見！',
    duration: 3000
  });
};

const feedbackForm = ref({
  serviceAgency: '環評委員',
  fullName: '王曉明',
  functionName: '',
  opinion: ''
});
const updateUserOpinion = async userValue => {
  console.log(userValue);
  submitForm();
};
</script>

<template>
  <WhiteContainer>
    <PageTitle>系統意見投書</PageTitle>
    <VForm v-slot="{ errors }" @submit="updateUserOpinion" class="mt-5">
      <div class="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <label class="text-secondary-600 py-2 ps-2 text-lg font-bold" for="serviceOrganization"
          ><span class="text-justify-115px">機關名稱</span><span>：</span></label
        >
        <div class="flex w-full items-center rounded-md bg-white">
          {{ feedbackForm.serviceAgency }}
        </div>
      </div>
      <div class="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <label class="text-secondary-600 py-2 ps-2 text-lg font-bold" for="serviceOrganization"
          ><span class="text-justify-115px">姓名</span><span>：</span></label
        >
        <div class="flex w-full items-center rounded-md bg-white">
          {{ feedbackForm.fullName }}
        </div>
      </div>
      <div class="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
        <label class="required-red text-secondary-600 py-2 ps-2 text-lg font-bold" for="serviceOrganization"
          ><span class="text-justify-115px">使用功能</span><span>：</span></label
        >
        <div class="col-span-2">
          <ValidateInput
            id="functionName"
            name="使用功能"
            type="text"
            placeholder="請輸入功能名稱"
            rules="required"
            :errors="errors"
            class="form-control"
            v-model="feedbackForm.functionName"
          />
        </div>
      </div>
      <div class="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
        <label class="required-red text-secondary-600 py-2 ps-2 text-lg font-bold" for="serviceOrganization"
          ><span class="text-justify-115px">意見</span><span>：</span></label
        >
        <div class="col-span-2">
          <ValidateTextArea
            id="opinion"
            name="意見"
            :validate="true"
            rules="required"
            :errors="errors"
            rows="1"
            cols="33"
            class="form-textarea"
            v-model="feedbackForm.opinion"
          ></ValidateTextArea>
        </div>
      </div>
      <div
        class="mt-4 text-center"
        :class="{
          'cursor-not-allowed': Object.keys(errors).length > 0
        }"
      >
        <button
          type="submit"
          class="btn btn-primary"
          :class="{
            'pointer-events-none opacity-75': Object.keys(errors).length > 0
          }"
        >
          送出
        </button>
      </div>
    </VForm>
  </WhiteContainer>
</template>
<style scoped>
.text-justify-115px {
  width: 115px;
  display: inline-block;
  text-align-last: justify;
}
</style>
