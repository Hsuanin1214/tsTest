# SaveButton.vue 元件說明文件

此元件為一個通用儲存按鈕元件，提供以下功能特性：

- 支援 loading 狀態
- 支援根據錯誤訊息與可儲存狀態控制按鈕啟用
- 支援動態樣式變化
- 支援插槽自訂按鈕文字

---

## 使用方式

```vue
<SaveButton :title="'儲存'" :isLoading="isSubmitting" :isSaveEnabled="true" :errors="formErrors" @click="handleSave" />
```

---

## Props 說明

| 名稱          | 類型    | 預設值      | 說明                                                        |
| ------------- | ------- | ----------- | ----------------------------------------------------------- |
| title         | String  | `'按鈕'`    | 按鈕的標題，用於 tooltip 顯示                               |
| isLoading     | Boolean | `false`     | 是否顯示處理中狀態與 loading icon                           |
| isSaveEnabled | Boolean | `true`      | 是否允許按鈕可點擊                                          |
| color         | String  | `'primary'` | 按鈕樣式，可選 primary、primaryOutline、secondary、disabled |
| errors        | Object  | `{}`        | 表單錯誤訊息，若存在則按鈕禁用                              |

---

## 計算屬性

### `bgColor`

根據 `color` 屬性取得對應按鈕樣式。

### `buttonClasses`

若表單錯誤存在或儲存不允許，按鈕會顯示為無法點擊樣式。

### `isDisabled`

若 `errors` 存在或 color 設為 disabled，按鈕會被禁用。

---

## 畫面結構

- 外層 div 控制整體點擊行為
- 內部 button 使用 `$attrs` 繼承父層所有原生屬性
- 插槽內容支援自訂文字（預設為「送出」）
- 若 `isLoading = true`：
  - 顯示 EllipsisHorizontalIcon 圖示
  - 顯示「處理中...」文字

---

## 注意事項

- 若需支援圖示動畫或 loading icon，可將 `LoadingIcon.vue` 引入並替換 `EllipsisHorizontalIcon`
- 當 `errors` 有任意鍵值存在時，會自動禁用按鈕避免提交錯誤資料
- `$attrs` 可讓此元件繼承例如 `type="submit"` 等屬性

---

## 建議

- 可搭配 `vee-validate` 使用，以錯誤物件作為錯誤控制依據
- 建議透過 slot 自訂按鈕文字與樣式，提升彈性
