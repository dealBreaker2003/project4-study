const { createApp, ref, reactive, computed, watch } = Vue;

// Vue3 密码生成器组件
const PasswordGenerator = {
  setup() {
    // ==================== 响应式数据 (替代DOM获取) ====================
    const password = ref('hello');
    const length = ref(12);
    const useHardRandom = ref(true);
    const copyIcon = ref('far fa-copy');
    const copyIconColor = ref('#718096');
    
    // 复选框状态 (替代多个独立的checkbox DOM元素)
    const options = reactive({
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    });

    // 字符集 (保持不变)
    const charSet = [
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "abcdefghijklmnopqrstuvwxyz", 
      "0123456789",
      "!@#$%^&*()-_=+[]{}|;:,.<>?/"
    ];

    // 计算属性 (替代手动DOM更新)
    const lengthDisplay = computed(() => length.value);
    const checkBoxes = computed(() => [
      options.uppercase,
      options.lowercase,
      options.numbers,
      options.symbols
    ]);

    const strengthInfo = computed(() => {
      const newPassword = password.value;
      let strengthScore = Math.min(newPassword.length * 2, 40);
      
      const checkRules = [
        /[A-Z]/,
        /[a-z]/, 
        /[0-9]/,
        /["!@#$%^&*()\-_=+[\]{}|;:,.<>?/"/],
      ];

      const activeTimes = checkRules
        .map(item => item.test(newPassword))
        .filter(stat => stat);

      for (const times of activeTimes) {
        strengthScore += 15;
      }

      if (newPassword.length < 8) strengthScore = Math.min(20, strengthScore);

      let barColor, labelContent;
      if (strengthScore < 40) {
        [barColor, labelContent] = ["#fc8181", "weak"];
      } else if (strengthScore < 70) {
        [barColor, labelContent] = ["#fbd38d", "medium"];
      } else {
        [barColor, labelContent] = ["#68d391", "strong"];
      }

      return {
        width: strengthScore + '%',
        background: barColor,
        label: labelContent
      };
    });

    // ==================== 方法 (替代函数和事件监听器) ====================
    
    // 密码生成核心逻辑 (保持原算法不变)
    function makePassword() {
      const makePara = checkBoxes.value.map(box => box);
      const passwordLength = Number(length.value);

      if (!makePara.includes(true)) {
        alert("请至少选择一种类型！");
        return;
      }

      const newPassword = createRandomPassword(passwordLength, ...makePara);
      password.value = newPassword;
    }

    function createRandomPassword(length, ...makePara) {
      // 坐标分配逻辑 (保持原算法)
      const portionNew = makePara.map(para => ({
        portion: !para ? -1 : useHardRandom.value ? 1 : 0,
      }));
      
      const activeNew = portionNew.filter(item => item.portion !== -1);
      const cordConfig = {
        count: activeNew.length - 1,
        max: length - activeNew.length * (useHardRandom.value ? 1 : 0),
      };

      const cords = getCords(cordConfig);

      activeNew.forEach((item, i) => {
        item.portion += cords[i + 1] - cords[i];
      });

      const pool = portionNew
        .map((item, index) => (item.portion > 0 ? index : -1))
        .filter(item => item !== -1);

      let passwordStr = "";

      while (passwordStr.length < length) {
        const poolIndex = Math.floor(Math.random() * pool.length);
        const targetIndex = pool[poolIndex];
        const charIndex = Math.floor(Math.random() * charSet[targetIndex].length);

        passwordStr += charSet[targetIndex][charIndex];
        portionNew[targetIndex].portion--;
        if (portionNew[targetIndex].portion === 0) {
          pool.splice(poolIndex, 1);
        }
      }

      return passwordStr;
    }

    function getCords({ count, max }) {
      let cords = [];
      for (let i = 0; i < count; i++) {
        const cord = Math.floor(Math.random() * (max + 1));
        cords.push(cord);
      }
      cords.sort((a, b) => a - b);
      cords.push(max);
      cords.unshift(0);
      return cords;
    }

    // 复制功能 (替代clipboard API + 手动icon切换)
    async function copyPassword() {
      if (!password.value) return;

      try {
        await navigator.clipboard.writeText(password.value);
        // Vue3中直接修改响应式数据，DOM自动更新
        copyIcon.value = 'fas fa-check';
        copyIconColor.value = '#48bb78';
        
        setTimeout(() => {
          copyIcon.value = 'far fa-copy';
          copyIconColor.value = '#718096';
        }, 1500);
      } catch (error) {
        console.log("复制不了：", error);
      }
    }

    // 暴露给模板的数据和方法
    return {
      // 数据
      password,
      length,
      lengthDisplay,
      useHardRandom,
      options,
      copyIcon,
      copyIconColor,
      strengthInfo,
      
      // 方法
      makePassword,
      copyPassword
    };
  },

  // Vue3模板 (替代HTML结构)
  template: `
    <div class="container">
      <h1>Password Generator</h1>
      
      <!-- 密码生成框 -->
      <div class="password-container">
        <input type="text" readonly :value="password" />
        <i :class="copyIcon" :style="{ color: copyIconColor }" @click="copyPassword" title="copy to clipboard"></i>
      </div>
      
      <!-- 密码选项 -->
      <div class="options">
        <!-- 密码长度 -->
        <div class="option">
          <label for="length">Password Length</label>
          <div class="range-container">
            <input type="range" id="length" min="6" max="24" v-model="length" />
            <span id="length-value">{{ lengthDisplay }}</span>
          </div>
        </div>
        
        <!-- v-for 替代重复的HTML结构 -->
        <div class="option" v-for="(label, key) in {
          uppercase: 'Include Uppercase',
          lowercase: 'Include Lowercase', 
          numbers: 'Include Numbers',
          symbols: 'Include Symbols'
        }" :key="key">
          <label :for="key">{{ label }}</label>
          <input type="checkbox" :id="key" v-model="options[key]" />
        </div>
      </div>
      
      <!-- 软硬切换 -->
      <div class="switch-container">
        <label for="switch-btn">use hard random?</label>
        <input type="checkbox" id="switch-btn" v-model="useHardRandom" />
      </div>
      
      <!-- 生成按钮 -->
      <button id="generate-btn" @click="makePassword">
        <i class="fas fa-key"></i>
        Generate Password
      </button>
      
      <!-- 强度评估 -->
      <div class="strength-container">
        <p>Password Strength : <span id="strength-label">{{ strengthInfo.label }}</span></p>
        <div class="strength-meter">
          <div class="strength-bar" :style="{
            width: strengthInfo.width,
            background: strengthInfo.background
          }"></div>
        </div>
      </div>
    </div>
  `
};

// 创建Vue应用实例 (替代DOMContentLoaded)
createApp({
  components: {
    'password-generator': PasswordGenerator
  }
}).mount('#app');