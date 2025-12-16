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

// Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

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

//软随机
//生成密码的执行逻辑，接受密码要求的五个参数，生成密码
//通过随机序列取样组合

// function createRandomPassword(
//   length,
//   includeUppercase,
//   includeLowercase,
//   includeNumbers,
//   includeSymbols
// ) {
//   //密码需要的数据类型

//   let passwordPool = "";
//   let password = "";

//   const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
//   const numberCharacters = "0123456789";
//   const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";
//   //确定随机池子
//   if (includeUppercase) passwordPool += uppercaseLetters;
//   if (includeLowercase) passwordPool += lowercaseLetters;
//   if (includeNumbers) passwordPool += numberCharacters;
//   if (includeSymbols) passwordPool += symbolCharacters;

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * passwordPool.length);
//     password += passwordPool[randomIndex];
//   }

//   return password;
// }

//优化：硬随机
//每确定一个数据类型就在这里先娶一位，最后循环次数减去取的次数，在大池子取就行
function createRandomPassword(
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) {
  //密码初始化成数组，后面好洗牌
  let password = [];
  let passwordPool = "";

  //四个池子
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numberCharacters = "0123456789";
  const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

  //每选择一个数据类型，在本地带走一个，然后扩充最后用到的的池子//foreach更好但我不会
  if (includeUppercase) {
    passwordPool += uppercaseLetters;
    const randomIndex = Math.floor(Math.random() * uppercaseLetters.length);
    password.push(uppercaseLetters[randomIndex]);
    length--;
  }
  if (includeLowercase) {
    passwordPool += lowercaseLetters;
    const randomIndex = Math.floor(Math.random() * lowercaseLetters.length);
    password.push(lowercaseLetters[randomIndex]);
    length--;
  }
  if (includeNumbers) {
    passwordPool += numberCharacters;
    const randomIndex = Math.floor(Math.random() * numberCharacters.length);
    password.push(numberCharacters[randomIndex]);
    length--;
  }
  if (includeSymbols) {
    passwordPool += symbolCharacters;
    const randomIndex = Math.floor(Math.random() * symbolCharacters.length);
    password.push(symbolCharacters[randomIndex]);
    length--;
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * passwordPool.length);
    password.push(passwordPool[randomIndex]);
  }
  //洗牌算法，消除前四位位置固定的隐患
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

//评估密码强度
//传入生成的密码
//是否包含各种数据类型/密码长度，进行打分
//根据分数改变强度条状态和标签文本
function updateStrengthMeter(newPassword) {
  //正则检查
  const passwordLength = newPassword.length;
  const haveUppercase = /[A-Z]/.test(newPassword);
  const haveLowercase = /[a-z]/.test(newPassword);
  const haveNumbers = /[0-9]/.test(newPassword);
  const haveSymbols = /["!@#$%^&*()-_=+[\]{}|;:,.<>?/"]/.test(newPassword);

  //最高分要求，超过20位才能拿满分，最高长度分数40，不然会溢出
  let strengthScore = Math.min(passwordLength * 2, 40);
  if (haveUppercase) strengthScore += 15;
  if (haveLowercase) strengthScore += 15;
  if (haveNumbers) strengthScore += 15;
  if (haveSymbols) strengthScore += 15;

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
    await navigator.clipboard.writeText(passwordInput.value);
    //等待执行，完了直接调用函数换图标，不用等反馈then，出了问题直接catch
    iconSwitch();
  } catch (error) {
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
