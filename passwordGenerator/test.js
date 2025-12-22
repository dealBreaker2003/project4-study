// #region 2 配额逻辑·

// #region 2.1 初始化配置

// 参数.map直接返回对象成员数组！！！！！！！我日你哥
const charSet = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "!@#$%^&*()-_=+[]{}|;:,.<>?/",
];

let switchBtn = 1;
const length1 = 10;
const makePara = [true, false, true, true];

// 创建内部流通的portion数组
let portionNew = makePara.map((para) => ({
  portion: !para ? -1 : switchBtn ? 1 : 0,
}));
console.log(portionNew);

const activeNew = portionNew.filter((item) => item.portion !== -1);
console.log(activeNew);

// 配置坐标

const nodeNum = activeNew.length - 1; // 坐标个数

const maxNew = length1 - activeNew.length * (switchBtn ? 1 : 0); //最大坐标

// 获取坐标
const cords = [];
for (let i = 0; i < nodeNum; i++) {
  const cord = Math.floor(Math.random() * (maxNew + 1));
  cords.push(cord);
}

cords.sort((a, b) => a - b);
console.log(cords);

// 加上做差头尾
cords.push(maxNew);
cords.unshift(0);

console.log("完整cords：", cords);

// 分配到activeNew
for (let i = 0; i < activeNew.length; i++) {
  activeNew[i].portion += cords[i + 1] - cords[i];
}

console.log(activeNew);

// 开始取样

let password = "";
let counter = 0;

// 直接获取活跃成员的索引，排除不活跃成员
// 拿到活跃序列号
/* const pool = portionNew.reduce((arr, item, index) => {
  if (item.portion > 0) {
    arr.push(index);
    return arr;
  }
  return arr;
}, []);
 */

const pool = portionNew
  .filter((item) => item.portion > 0)
  .map((item, index) => ({ item, char: charSet[index] }));

console.log(pool);

//
while (password.length < length1) {
  const index1 = Math.floor(Math.random() * pool.length);
  const targetIndex = pool[index1];
  const index2 = Math.floor(Math.random() * charSet[targetIndex].length);
  password += charSet[targetIndex][index2];
  portionNew[targetIndex].portion--;
  if (portionNew[targetIndex].portion < 1) {
    pool.splice(index1, 1);
  }
  console.log(targetIndex);
}

console.log(password);

// #endregion

// #region 2.2 配额逻辑实现

/* // #region 2.2.1 配额

//割绳子

const numSet = [1, 2, 3];
const varSet = [p1, p2, p3];
let length = varSet.length;

for (const item of varSet) {
  item = numSet[Math.floor(Math.random() * length)];
  numSet = numSet.filter((stat) => stat != item);
  length--;
}

//偏差随机数
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

// #endregion

// #endregion */
// #endregion

const arr1 = [1, 3, 5, 34, 6];
arr1.forEach((item, i) => {
  console.log(i, item);
});
