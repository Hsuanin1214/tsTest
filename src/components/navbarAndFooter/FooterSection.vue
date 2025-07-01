<script setup>
import { ref } from 'vue';
import faceImg from '@/assets/images/icons/fb.svg';
import youTubeImg from '@/assets/images/icons/youtube.svg';
import lineImg from '@/assets/images/icons/line.svg';
import AccessibilityGuild from '@/components/uiComponents/AccessibilityGuild/AccessibilityGuild.vue';

const footerData = ref({
  links: [
    {
      href: 'https://www.moenv.gov.tw/Page/285410B281867E93',
      text: '網頁政策及宣告',
      title: '前往網頁政策及宣告的網頁(另開視窗)'
    },
    {
      href: 'https://www.moenv.gov.tw/Page/E6525EED58F263A3',
      text: '隱私權保護政策',
      title: '前往隱私權保護政策的網頁(另開視窗)'
    },
    {
      href: 'https://www.moenv.gov.tw/Page/7CED63B63DB9E5DF',
      text: '網站資料開放宣告',
      title: '前往網站資料開放宣告的網頁(另開視窗)'
    }
  ],
  infos: {
    environmentAddress: '100006臺北市中正區中華路一段83號',
    environmentPhone: '（02）2311－7722 分機＃2740 ～＃2749',
    consultant: '環資國際有限公司',
    consultantPhone: '（02）2361－1999 ＃437',
    notificationPhone: '（02）2311－7722＃2740',
    updateDate: '113／04／26'
  },
  socials: [
    {
      href: 'https://www.youtube.com/@TaiwanEpaTW/playlists',
      imgSrc: youTubeImg,
      alt: 'Youtube icon',
      title: '前往環境部 Youtube (另開視窗)'
    },
    {
      href: 'https://www.moenv.gov.tw/Page/5BE8739FFBB880CB',
      imgSrc: faceImg,
      alt: 'Facebook icon',
      title: '前往環境部 Facebook (另開視窗)'
    },
    {
      href: 'https://line.me/R/ti/p/KjOox0U09B',
      imgSrc: lineImg,
      alt: 'Line icon',
      title: '前往環境部 Line (另開視窗)'
    }
  ]
});
</script>
<template>
  <footer class="bg-secondary-600">
    <div class="container mx-auto px-4 py-6">
      <AccessibilityGuild position="footer" class="mb-2 text-white" />

      <div class="mb-4 flex gap-4">
        <a
          v-for="link in footerData.links"
          :key="link.href"
          :href="link.href"
          :title="link.title"
          target="_blank"
          class="btn rounded-none border-white text-white hover:bg-gray-100 hover:text-gray-700"
        >
          {{ link.text }}
        </a>
      </div>
      <div class="flex flex-col items-end justify-between text-white md:flex-row">
        <ul>
          <li class="mb-1">
            地址：{{ footerData.infos.environmentAddress }} ． 聯絡電話：{{ footerData.infos.environmentPhone }}
          </li>
          <li class="mb-1">
            網站維護：{{ footerData.infos.consultant }} ． 聯絡電話：{{ footerData.infos.consultantPhone }}
          </li>
          <li class="mb-1">
            書件內容如有錯誤或不實，敬請通報
            {{ footerData.infos.notificationPhone }}
          </li>

          <li class="mb-1">更新日期：{{ footerData.infos.updateDate }}</li>
        </ul>
        <div class="flex gap-2">
          <a
            v-for="social in footerData.socials"
            :key="social.href"
            :href="social.href"
            target="_blank"
            :title="social.title"
            class="hover:opacity-80"
          >
            <img :src="social.imgSrc" :alt="social.alt" width="35" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
