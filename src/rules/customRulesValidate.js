import * as AllRules from '@vee-validate/rules';
// import checkEmailAvailability from '@/service/CheckAvailableService'; // 導入函數

export default {
  // 只能輸入中文的規則
  chineseOnly: value => {
    if (!value) {
      return true;
    }
    const regex = /^[\u4e00-\u9fa5；;]+$/; // 包含中文字符和分號
    return regex.test(value) || '只能輸入中文及分號';
  },
  // 案件新增規則
  forumRequired: value => {
    if (!value) {
      return '若案件年份大於等於106年，且類別等於"說明書"，須建立論壇資料';
    }
    return true;
  },
  // 帳號不得與密碼相同
  differentFromPassword: (value, [nameOrPasswordField], ctx) => {
    const words = ctx.form[nameOrPasswordField];
    return value !== words || '帳號與密碼不可相同';
  },
  // 密碼複雜性檢查規則
  passwordComplexity: value => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{12,}$/;
    return regex.test(value) || import.meta.env.VITE_VALIDATE_PWD_MSG;
  },

  // 密碼確認規則
  confirmed: (value, [target], ctx) => {
    return value === ctx.form[target] || import.meta.env.VITE_VALIDATE_PWD_CONFIRM_MSG; // 需在驗證處加上 confirmed:輸入密碼(為第一次入密碼的name)
  },
  // 姓名輸入中英文規則
  // chineseEnglishOnly: (value) => {
  // 	const regex = /^[a-zA-Z\u4e00-\u9fa5]+$/;
  // 	return regex.test(value) || '帳號只能包含中文和英文';
  // },
  // 檢查電子郵件是否已被使用(備用)
  emailAvailable: async value => {
    // 必填驗證
    const requiredValidation = AllRules.required(value);
    if (requiredValidation !== true) {
      return '此欄位是必填項';
    }
    // 郵件格式驗證
    const emailValidation = AllRules.email(value);
    if (emailValidation !== true) {
      return '請輸入有效的電子郵件地址';
    }
    return '此信箱可使用';
  },
  /** 檔案格式 */
  fileType: async files => {
    if (!files || files.length === 0) {
      return '請上傳檔案';
    }

    const file = files;
    if (!file) {
      return '找不到檔案';
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const arr = new Uint8Array(arrayBuffer).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i += 1) {
        header += arr[i].toString(16);
      }
      // PDF 檔案的頭部應為 25 50 44 46 (即 %PDF)
      if (header.startsWith('25504446')) {
        return true;
      }
      return '格式不正確，請上傳 PDF 格式的檔案';
    } catch (error) {
      console.log(error);
      return '檔案讀取失敗';
    }
  },
  conclusionFileType: async files => {
    if (!files) {
      return true;
    }
    const file = files;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const arr = new Uint8Array(arrayBuffer).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i += 1) {
        header += arr[i].toString(16);
      }
      // PDF 檔案的頭部應為 25 50 44 46 (即 %PDF)
      if (header.startsWith('25504446')) {
        return true;
      }
      return '格式不正確，請上傳 PDF 格式的檔案';
    } catch (error) {
      console.log(error);
      return '檔案讀取失敗';
    }
  },
  revocationFileType: async files => {
    if (!files) {
      return true;
    }

    const file = files;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const arr = new Uint8Array(arrayBuffer).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i += 1) {
        header += arr[i].toString(16);
      }
      // PDF 檔案的頭部應為 25 50 44 46 (即 %PDF)
      if (header.startsWith('25504446')) {
        return true;
      }
      return '格式不正確，請上傳 PDF 格式的檔案';
    } catch (error) {
      console.log(error);
      return '檔案讀取失敗';
    }
  }
};
