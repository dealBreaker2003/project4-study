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

// 打包盒子 一次操作，
const checkBoxes = [
  uppercaseCheckbox,
  lowercaseCheckbox,
  numbersCheckbox,
  symbolsCheckbox,
];
// 盒子对应取样池
const charSet = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "!@#$%^&*()-_=+[]{}|;:,.<>?/",
];

//设置滑块显示，将滑块的长度值赋给标签文本内容，显示当前密码长度
lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", makePassword);

// 因为布尔值存放顺序不变，所以执行逻辑只需要布尔值数组，内部也不会改变变量，按既定的顺序过一遍机器
// 生成密码
function makePassword() {
  // map创建参数数组

  const makePara = checkBoxes.map((box) => box.checked);
  const length = Number(lengthSlider.value);

  // 强制最少选一种类型=>数组include
  if (!makePara.includes(true)) {
    alert("请至少选择一种类型！");
    return;
  }

  // 拆包传参function（...())，
  const newPassword = createRandomPassword(length, ...makePara);

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
 * function(...())打包接收参数，函数内部直接使用参数数组操作
 */
function createRandomPassword(length, ...makePara) {
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
  //...操作符+for of，循环添加成员
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

  // 参数.map直接返回对象成员数组！！！！！！！我日你哥

  /*  const portionGet = makePara.map((item) => ({ condition: item, portion: 0 })); // 对于每一个item，把他打包进一个对象成员，并返回到这个item的位置

  //页面输入筛选参与的类型
  const activePortion = portionGet.filter((item) => item.condition);
  // console.log(activePortion);

  const activeLength = activePortion.length;
  let minTake = switchBtn.checked ? 1 : 0; // 软硬切换决定保底值从而实现~
  let max = length - minTake * activeLength; // 随机数生成范围
  let password = []; // 便于洗牌 */

  // #endregion

  // #region 2.2 配额逻辑实现

  // #region 2.2.1 配额
  /* for (let i = 0; i < activeLength; i++) {
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

  // 初始化最终需求状态，份额加池子

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
 */
  // #endregion

  // #endregion
  // #endregion

  // #region 3 节点长度分配
  // TODO

  // #region 3.1 初始化配置
  // console.log(makePara);

  // 根据 切换按钮 和 是否勾选该类型 做初始化赋值
  const portionNew = makePara.map((para) => ({
    portion: !para ? -1 : switchBtn.checked ? 1 : 0, // 三元式嵌套：两个条件决定的三个值
  }));
  // 用filter直接操作勾选的类型 并 确保赋值追踪到portionNew
  const activeNew = portionNew.filter((item) => item.portion !== -1);
  // 坐标参数配置
  const cordConfig = {
    count: activeNew.length - 1, // 坐标个数
    max: length - activeNew.length * (switchBtn.checked ? 1 : 0), // 最大坐标
  };

  // #endregion

  // #region 3.2 逻辑实现

  // 获取坐标
  const cords = getCords(cordConfig);

  // 坐标差值（份额）分配到activeNew   // NOTE:foreach 替代 for循环的应用 （i）
  activeNew.forEach((item, i) => {
    // 全自动的i
    item.portion += cords[i + 1] - cords[i];
  });

  /*   for (let i = 0; i < activeNew.length; i++) {
    activeNew[i].portion += cords[i + 1] - cords[i];
  } */
  // 开始取样
  // 直接获取活跃成员的索引池，排除不活跃成员  NOTE:待操作数组不要用const初始化

  // Ⅰ reduce方法
  /*   const pool = portionNew.reduce((arr, item, index) => {
    if (item.portion > 0) {
      arr.push(index);
      return arr;
    }
    return arr; 
  }, []); */

  // Ⅱ map + filter 链式调用
  const pool = portionNew
    .map((item, index) => (item.portion > 0 ? index : -1)) // 临时数组只包含索引或区分量
    .filter((item) => item !== -1); // 只要拿到的索引

  // 配额检查
  console.log("取样前配额检查", JSON.parse(JSON.stringify(portionNew))); // 核查分配前的份额情况

  // 开始按份额取样
  let password = ""; // 密码容器

  while (password.length < length) {
    // 配置需要的索引
    const poolIndex = Math.floor(Math.random() * pool.length); // 从索引池抽索引
    const targetIndex = pool[poolIndex]; // 设置被抽到的索引为循环对象索引
    const charIndex = Math.floor(Math.random() * charSet[targetIndex].length); // 抽取该次循环对应字符池要push的字符索引
    console.log("当前索引：", targetIndex);

    // 操作密码
    password += charSet[targetIndex][charIndex];
    portionNew[targetIndex].portion--;
    portionNew[targetIndex].portion === 0 && pool.splice(poolIndex, 1);
    /*  if (portionNew[targetIndex].portion === 0) {
      pool.splice(poolIndex, 1); // 额度用完从索引池移除该索引，确保每次都能抽到有机会的类型，避免循环跑空
    } */
  }

  // #endregion
  // #endregion
  return password;
}

// 计算坐标
/**
 *
 * @param {object} cordConfig坐标变量对象
 * @returns {string} cords 坐标
 */
function getCords({ count, max }) {
  let cords = [];
  for (let i = 0; i < count; i++) {
    const cord = Math.floor(Math.random() * (max + 1));
    cords.push(cord);
  }

  // 坐标池排序，避免做差出现负值
  cords.sort((a, b) => a - b);
  // 补全做差头尾
  cords.push(max);
  cords.unshift(0);

  return cords;
}
//======================================================评估密码强度==========================================
//传入生成的密码
//是否包含各种数据类型/密码长度，进行打分
//根据分数改变强度条状态和标签文本

//
function updateStrengthMeter(newPassword) {
  //正则检查
  const poolLength = charSet.length;
  const checkRules = [
    /[A-Z]/,
    /[a-z]/,
    /[0-9]/,
    /["!@#$%^&*()\-_=+[\]{}|;:,.<>?/"]/,
  ];

  //最高分要求，超过20位才能拿满分，最高长度分数40，不然会溢出
  const passwordLength = newPassword.length;

  let strengthScore = Math.min(passwordLength * 2, 40);
  console.log(`密码长度分数：${strengthScore}`);

  // 分数计算不需要绑定数据类型，只需要知道选了几个
  const checkTimes = checkRules.map((type) => type.test(newPassword));
  // 从需要正则的容器获取所有类型数量，再filter计算选中数量
  const activeTimes = checkTimes.filter((staTs) => staTs);

  for (const times of activeTimes) {
    strengthScore += 15;
  }

  //强制短密码低分
  if (passwordLength < 8) strengthScore = Math.min(20, strengthScore);

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

//=====================================================复制按钮
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
