// "use strict";

const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("Uppercase");
const lowercaseCheckbox = document.getElementById("Lowercase");
const numbersCheckbox = document.getElementById("Numbers");
const symbolsCheckbox = document.getElementById("Symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthLabel = document.getElementById("strength-label");
const switchBtn = document.getElementById("switch-btn");

// DOM Elements - all the elements we need from HTML
// const passwordInput = document.getElementById("password");
// const lengthSlider = document.getElementById("length");
// const lengthDisplay = document.getElementById("length-value");
// const uppercaseCheckbox = document.getElementById("uppercase");
// const lowercaseCheckbox = document.getElementById("lowercase");
// const numbersCheckbox = document.getElementById("numbers");
// const symbolsCheckbox = document.getElementById("symbols");
// const generateButton = document.getElementById("generate-btn");
// const copyButton = document.getElementById("copy-btn");
// const strengthBar = document.querySelector(".strength-bar");
// const strengthText = document.querySelector(".strength-container p");

//设置滑块显示，将滑块的长度值赋给标签文本内容，显示当前密码长度
lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", makePassword);

//生成函数，检查勾选的数据类型，强制至少选一种
//然后调用外部函数进行具体逻辑处理，最后返回生成的密码更新在密码框
function makePassword() {
  const length = Number(lengthSlider.value);
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;

  if (
    !includeUppercase &&
    !includeLowercase &&
    !includeNumbers &&
    !includeSymbols
  ) {
    alert("请至少选择一种数据类型！");
    return;
  }

  const newPassword = createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  );
  passwordInput.value = newPassword;
  updateStrengthMeter(newPassword);
}

//=======================================================生成逻辑===========================================

/**
 *
 * @param {number} length - 密码长度
 * @param {boolean} includeUppercase - 是否包含大写
 * @param {boolean} includeLowercase - 是否包含小写
 * @param {boolean} includeNumbers - 是否包含数字
 * @param {boolean} includeSymbols - 符号
 * @returns {string} password - 打乱顺序后的随机密码
 */
function createRandomPassword(
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) {
  // #region 1 保底逻辑
  // #region 1.1 初始化配置
  // 密码初始化成数组，后面好洗牌
  /* let password = [];
  let passwordPool = "";

  const charSet = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "!@#$%^&*()-_=+[]{}|;:,.<>?/",
  ];

  // 解构赋值
  const [
    uppercaseLetters,
    lowercaseLetters,
    numberCharacters,
    symbolCharacters,
  ] = charSet; */
  // #endregion

  // #region 1.2 逻辑实现
  // NOTE:for...of封装

  // 配置数据
  // input
  /* const optionPools = [
    { check: includeUppercase, pool: uppercaseLetters },
    { check: includeLowercase, pool: lowercaseLetters },
    { check: includeNumbers, pool: numberCharacters },
    { check: includeSymbols, pool: symbolCharacters },
  ];

  // 扩展：用filter筛选出勾选类型，进一步优化执行代码
  const activePool = optionPools.filter((staTs) => staTs.check);
  //console.log(activePool);

  // 逻辑执行机器
  // machine
  // NOTE:for...of取代循环+函数传参/对象解构赋值/保底逻辑，

  for (const { check, pool } of activePool) {
    passwordPool += pool;
    const randomIndex = Math.floor(Math.random() * pool.length);
    password.push(pool[randomIndex]);
    length--;
  }
  // 补全密码
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * passwordPool.length);
    password.push(passwordPool[randomIndex]);
  }

  // 洗牌算法，消除前四位位置固定的隐患
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

   */
  // #endregion
  // #endregion

  // #region 2 配额逻辑·

  // #region 2.1 初始化配置
  const portionGet = [
    { condition: includeUppercase, portion: 0 },
    { condition: includeLowercase, portion: 0 },
    { condition: includeNumbers, portion: 0 },
    { condition: includeSymbols, portion: 0 },
  ];

  const activePortion = portionGet.filter((item) => item.condition);

  // console.log(activePortion);
  const activeLength = activePortion.length;

  let minTake = switchBtn.checked ? 1 : 0;
  let max = length - minTake * activeLength; // 随机数生成范围
  let password = [];

  // #endregion

  // #region 2.2 配额逻辑实现

  // #region 2.2.1 配额
  for (let i = 0; i < activeLength; i++) {
    const isLast = i === activeLength - 1; // NOTE:确保最后一个之前都是随机 3+1
    const take = isLast ? max : Math.floor(Math.random() * (max + 1));
    //合并三个步骤进行的四次循环，3+1=4
    activePortion[i].portion = take + minTake; //保底
    max -= take;
  }

  // console.log(activePortion);
  // console.log("洗牌前:", JSON.stringify(activePortion.map((i) => i.portion)));

  //份额洗牌 一定程度上抵消第一份份额过大的不公平性
  for (let i = activePortion.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [activePortion[i], activePortion[j]] = [activePortion[j], activePortion[i]];
  }

  // console.log("洗牌后:", JSON.stringify(activePortion.map((i) => i.portion)));
  //console.log(activePortion);
  // console.log(portionGet);
  // #endregion

  // #region 2.2.2 按配额取样

  // 初始化最终需求状态，加池子
  const charSet = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "!@#$%^&*()-_=+[]{}|;:,.<>?/",
  ];

  charSet.forEach((chars, index) => {
    portionGet[index].pool = chars;
  }); // 直接新建对象属性 ，日吊

  console.log(portionGet);
  // 按需取样实现
  for (const item of portionGet) {
    for (let i = 0; i < item.portion; i++) {
      const randomIndex = Math.floor(Math.random() * item.pool.length);
      password.push(item.pool[randomIndex]);
    }
  }

  // 密码洗牌（最后一次
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  // #endregion

  // #endregion
  // #endregion
  return password.join("");
}

//=============================================================评估密码强度==========================================
//传入生成的密码
//是否包含各种数据类型/密码长度，进行打分
//根据分数改变强度条状态和标签文本

//
function updateStrengthMeter(newPassword) {
  //正则检查
  const passwordLength = newPassword.length;
  const haveUppercase = /[A-Z]/.test(newPassword);
  const haveLowercase = /[a-z]/.test(newPassword);
  const haveNumbers = /[0-9]/.test(newPassword);
  const haveSymbols = /["!@#$%^&*()\-_=+[\]{}|;:,.<>?/"]/.test(newPassword);

  //最高分要求，超过20位才能拿满分，最高长度分数40，不然会溢出
  let strengthScore = Math.min(passwordLength * 2, 40);
  console.log(`密码长度分数：${strengthScore}`);

  /* if (haveUppercase) strengthScore += 15;
  if (haveLowercase) strengthScore += 15;
  if (haveNumbers) strengthScore += 15;
  if (haveSymbols) strengthScore += 15; */

  const testOptions = [
    { name: haveUppercase, value: "有大写" },
    { name: haveLowercase, value: "有小写" },
    { name: haveNumbers, value: "有数字" },
    { name: haveSymbols, value: "有字符" },
  ];

  const activeTest = testOptions.filter((staTs) => staTs.name);
  // console.log(activeTest);

  //打印方便调=>正则符号漏洞
  for (option of activeTest) {
    strengthScore += 15;
    console.log(strengthScore, option.value);
  }

  /* if (haveUppercase) {
    strengthScore += 15;
    console.log(strengthScore, "daxie");
  }

  if (haveLowercase) {
    strengthScore += 15;
    console.log(strengthScore, "xiaoxie");
  }
  if (haveNumbers) {
    strengthScore += 15;
    console.log(strengthScore, "shuzi");
  }
  if (haveSymbols) {
    strengthScore += 15;
    console.log(strengthScore, "fuhao");
  }
  console.log(strengthScore); */

  //强制短密码低分
  if (passwordLength < 8) strengthScore = Math.min(20, strengthScore);

  //限制最高分？这里不会出现超过一百
  //传入长度
  strengthBar.style.width = strengthScore + "%";

  //根据分数设置颜色和标签
  let barColor = "";
  let labelContent;

  if (strengthScore < 40) {
    barColor = "#fc8181";
    labelContent = "weak";
  } else if (strengthScore < 70) {
    barColor = "#fbd38d";
    labelContent = "medium";
  } else {
    barColor = "#68d391";
    labelContent = "strong";
  }

  strengthBar.style.background = barColor;
  strengthLabel.textContent = labelContent;
}

//async/await
//
copyButton.addEventListener("click", async () => {
  if (!passwordInput) return;

  try {
    //想要执行的代码

    await navigator.clipboard.writeText(passwordInput.value);
    // await暂停这次click导致的事件，直到剪切板成功写入passwordInput，返回promise{fulfilled，undefined}
    // 失败则抛出error，终止try内的语句执行

    iconSwitch();
    // 按顺序调用iconSwitch
  } catch (error) {
    // 如果尝试失败，会捕捉writeText抛出的error
    //then(null,reject)
    console.log("复制不了：", error);
  }
});

//promise链

// copyButton.addEventListener("click", () => {
//   if (!passwordInput) return;

//   navigator.clipboard
//     .writeText(passwordInput.value)
//     .then(() => iconSwitch())
//     .catch((error) => console.log("复制不了：", error));
// });

function iconSwitch() {
  copyButton.classList.remove("far", "fa-copy");
  copyButton.classList.add("fas", "fa-check");
  copyButton.style.color = "#48bb78";

  setTimeout(() => {
    copyButton.classList.remove("fas", "fa-check");
    copyButton.classList.add("far", "fa-copy");
    copyButton.style.color = "";
  }, 1500);
}
