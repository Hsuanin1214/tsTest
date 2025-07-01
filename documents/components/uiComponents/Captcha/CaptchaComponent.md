# CaptchaComponent.vue 元件說明文件

- 顯示圖形驗證碼圖片（目前已註解，可依需求開啟）
- 支援語音播放驗證碼
- 提供重新取得驗證碼按鈕
- 表單驗證輸入框（使用 `ValidateInput`）
- 雙向綁定 `captchaCode` 值（透過 `defineModel`）

## 檔案位置

/components/CaptchaComponent.vue

## 使用方式

```vue
<CaptchaComponent v-model:captchaCode="yourCaptchaCode" :errors="formErrors" />
```

### Props

| 名稱   | 類型   | 說明                     |
| ------ | ------ | ------------------------ |
| errors | Object | 表單驗證錯誤訊息（可選） |

### v-model 綁定欄位

| 名稱        | 類型   | 必填 | 說明             |
| ----------- | ------ | ---- | ---------------- |
| captchaCode | String | V    | 圖形驗證碼輸入值 |

---

## 元件內部資料說明

### `config` 結構

```ts
config = {
  img: {
    param: { responseType: 'arraybuffer' },
    captchaImageUrl: '',
    type: 'image/png'
  },
  audio: {
    param: { responseType: 'blob' },
    audioUrl: '',
    type: 'audio/wav'
  }
};
```

### 方法（目前註解中）

- `generateCaptcha()`: 透過 API 產生新的圖形驗證碼與語音驗證檔案。
- `downLoadImgAndAudio(url, id, param, type)`: 下載語音或圖片 Blob 並轉為 URL。
- `loadAudio()`: 播放語音驗證碼。
- `getNewStamp()`: 重新產生 timestamp 並呼叫 `generateCaptcha()`。

---

## 畫面結構

- Label 標題「圖形驗證碼」
- 語音播放按鈕（SpeakerWaveIcon）
- 重新產生按鈕（ArrowPathIcon）
- 圖形驗證碼輸入欄位（ValidateInput）

---

## 注意事項

- `useAxios` 與 `useAlert` 尚未啟用（已註解），請視專案需求引入並解開註解。
- 若需顯示圖形驗證碼圖片，請將 `<img>` 標籤取消註解，並確保 `config.img.captchaImageUrl` 正確載入。
- 請確認 API `/SystemInfos/generate-captcha`, `/SystemInfos/get-captcha-image`, `/SystemInfos/get-captcha-audio` 有正確串接。
