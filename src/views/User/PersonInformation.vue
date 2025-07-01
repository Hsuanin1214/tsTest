<script setup>
import { ref } from 'vue';
import WhiteContainer from '@/components/uiComponents/WhiteContainer/WhiteContainer.vue';
import PageTitle from '@/components/uiComponents/PageTitle/PageTitle.vue';

const userInfo = ref({
  userName: 'admin',
  fullName: '王曉明'
});
</script>

<template>
  <WhiteContainer>
    <PageTitle>個人資料</PageTitle>
    <div class="mt-5">
      <div class="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <label class="text-secondary-600 py-2 ps-2 text-lg font-bold" for="serviceOrganization"
          ><span class="text-justify-115px">帳號</span><span>：</span></label
        >
        <div class="flex w-full items-center justify-between rounded-md bg-white py-2">
          {{ userInfo.userName }}
        </div>
      </div>
      <div class="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <label class="text-secondary-600 py-2 ps-2 text-lg font-bold" for="serviceOrganization"
          ><span class="text-justify-115px">姓名</span><span>：</span></label
        >
        <div class="flex w-full items-center justify-between rounded-md bg-white py-2">
          {{ userInfo.fullName }}
        </div>
      </div>
      <div class="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <label class="text-secondary-600 py-2 ps-2 text-lg font-bold" for="serviceOrganization"
          ><span class="text-justify-115px">密碼</span><span>：</span></label
        >
        <div class="flex w-full items-center justify-between rounded-md bg-white py-2">
          <RouterLink to="/changePassword" class="a11y-focus hover:text-primary-600 text-cyan-500 hover:underline"
            >【按此修改密碼】</RouterLink
          >
        </div>
      </div>
    </div>
  </WhiteContainer>
</template>
<style scoped>
.text-justify-115px {
  width: 115px;
  display: inline-block;
  text-align-last: justify;
}
</style>
