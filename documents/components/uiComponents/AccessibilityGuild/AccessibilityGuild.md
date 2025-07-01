# 無障礙導盲磚元件

此元件為符合網站無障礙規範的導盲連結，根據不同 `position` 自動綁定 accesskey 快捷鍵，協助使用者快速跳轉至對應區塊。

---

## 功能簡述

- 提供四個導盲區塊：上方功能區塊、中央內容區塊、下方功能區塊、網站搜尋
- 依據傳入的 `position` 屬性，自動對應 `href`、`accesskey` 等資訊
- 支援自定義樣式 class
- 符合 A+ 網站無障礙規範

---

## Props 說明

| Prop 名稱  | 型別   | 說明                   | 可接受值                                       | 預設值               |
| ---------- | ------ | ---------------------- | ---------------------------------------------- | -------------------- |
| `position` | String | 導盲磚所對應的區塊位置 | `'navbar'`、`'center'`、`'footer'`、`'search'` | （必填）             |
| `class`    | String | 自定義樣式類別名稱     | 任意 class 名稱                                | `'text-eiadoc-blue'` |

> `position` 為必要屬性，若傳入不在指定清單中，Vue 將顯示 validator 警告。

---

## 內部邏輯說明

### `accessibilityType`

元件內部定義了四種導盲配置如下：

| blockName | href               | accesskey | title        |
| --------- | ------------------ | --------- | ------------ |
| `navbar`  | `#AccesskeyNavbar` | `U`       | 上方功能區塊 |
| `center`  | `#AccesskeyCenter` | `C`       | 中央內容區塊 |
| `footer`  | `#AccesskeyFooter` | `Z`       | 下方功能區塊 |
| `search`  | `#AccesskeySearch` | `S`       | 網站搜尋     |

### `accessibility` 計算屬性

根據傳入的 `props.position` 找出對應的區塊設定資料。

---

## 範例用法

```vue
<AccessKey position="footer" class="text-red-500" />
```

---

## 實際渲染結果範例

```html
<a
  href="#AccesskeyFooter"
  id="AccesskeyFooter"
  accesskey="Z"
  name="Z"
  title="下方功能區塊"
  class="text-eiadoc-blue hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-amber-500"
  rel="noopener noreferrer"
>
  :::
</a>
```

---

## 可選功能：掛載後自動聚焦

元件中預留了自動聚焦的程式碼，如需啟用請取消註解：

```ts
onMounted(() => {
  const targetElement = document.querySelector(accessibility.value.href);
  if (targetElement) {
    targetElement.focus();
  }
});
```
