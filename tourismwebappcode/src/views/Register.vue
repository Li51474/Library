<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../api/user';

const router = useRouter();

// Form data
const username = ref('');
const password = ref('');
const email = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Form validation
const usernameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const isSubmitting = ref(false);

// Toggle password visibility
const togglePasswordVisibility = (field: string) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

// 邮箱验证函数
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 添加验证函数
const validateUsername = (username: string) => {
  return username.length >= 4 && username.length <= 20;
};

const validatePassword = (password: string) => {
  return password.length >= 6 && password.length <= 20;
};

// Form submission
const handleSubmit = async () => {
  // Reset errors
  usernameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  
  // Basic validation
  let isValid = true;
  
  if (!username.value) {
    usernameError.value = '请输入用户名';
    isValid = false;
  } else if (!validateUsername(username.value)) {
    usernameError.value = '用户名长度必须在4-20个字符之间';
    isValid = false;
  }

  if (!email.value) {
    emailError.value = '请输入邮箱';
    isValid = false;
  } else if (!validateEmail(email.value)) {
    emailError.value = '请输入有效的邮箱地址';
    isValid = false;
  }
  
  if (!password.value) {
    passwordError.value = '请输入密码';
    isValid = false;
  } else if (!validatePassword(password.value)) {
    passwordError.value = '密码长度必须在6-20个字符之间';
    isValid = false;
  }
  
  if (!confirmPassword.value) {
    confirmPasswordError.value = '请确认密码';
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = '两次输入的密码不一致';
    isValid = false;
  }
  
  if (!isValid) return;
  
  try {
    isSubmitting.value = true;
    
    // 调用注册接口
    const res = await register(username.value, password.value, email.value);
    
    // 检查返回的状态码
    if (res.code === 500) {
      // 显示错误信息
      alert(res.message);
      return;
    }
    
    // 注册成功
    console.log('注册成功:', res);
    alert('注册成功！');
    
    // 注册成功后跳转到登录页
    router.push('/login');
  } catch (error) {
    console.error('注册失败:', error);
    // 处理错误，显示错误信息
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('注册失败，请稍后重试');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <!-- Animated gradient background -->
    <div class="gradient-background"></div>
    
    <!-- Register form card -->
    <div class="login-card">
      <h1>注册</h1>
      
      <form @submit.prevent="handleSubmit">
        <!-- Username field -->
        <div class="form-group">
          <label for="username">用户名</label>
          <div class="input-wrapper">
            <i class="icon username-icon">👤</i>
            <input 
              id="username" 
              type="text" 
              v-model="username" 
              placeholder="请输入用户名"
              :class="{ 'input-error': usernameError }"
            />
          </div>
          <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
        </div>

        <!-- Email field -->
        <div class="form-group">
          <label for="email">邮箱</label>
          <div class="input-wrapper">
            <i class="icon email-icon">✉️</i>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              placeholder="请输入邮箱"
              :class="{ 'input-error': emailError }"
            />
          </div>
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>
        
        <!-- Password field -->
        <div class="form-group">
          <label for="password">密码</label>
          <div class="input-wrapper">
            <i class="icon password-icon">🔒</i>
            <input 
              id="password" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password"
              placeholder="请输入密码"
              :class="{ 'input-error': passwordError }"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="togglePasswordVisibility('password')"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>

        <!-- Confirm Password field -->
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <div class="input-wrapper">
            <i class="icon password-icon">🔒</i>
            <input 
              id="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              v-model="confirmPassword"
              placeholder="请再次输入密码"
              :class="{ 'input-error': confirmPasswordError }"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="togglePasswordVisibility('confirm')"
            >
              {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
        </div>
        
        <!-- Submit button -->
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <!-- Login link -->
      <div class="register-link">
        已有账户? <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 复用 Login.vue 的样式 */
/* 添加以下全局样式到style标签的最前面 */
:root {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow: hidden;
}

/* 修改 .gradient-background 样式 */
.gradient-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  z-index: -1;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 其他样式与 Login.vue 相同 */
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin: 1rem;
}
.login-card:hover {
  transform: translateY(-5px);
}

h1 {
  margin: 0 0 1.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  text-align: left;
}

.subtitle {
  margin-bottom: 1.5rem;
  color: #666;
  text-align: center;
  font-size: 0.9rem;
}

/* Form elements */
.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
  text-align: left;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #23a6d5;
  box-shadow: 0 0 0 3px rgba(35, 166, 213, 0.1);
}

.input-error {
  border-color: #e73c7e;
}

.icon {
  position: absolute;
  left: 0.75rem;
  font-size: 1rem;
  color: #666;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  padding: 0;
}

.error-message {
  display: block;
  color: #e73c7e;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.forgot-password {
  color: #23a6d5;
  font-size: 0.8rem;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Checkbox styling */
.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  display: inline-block;
  height: 18px;
  width: 18px;
  margin-right: 8px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #f9f9f9;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #23a6d5;
  border-color: #23a6d5;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Button */
.login-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, #23a6d5, #23d5ab);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(35, 166, 213, 0.2);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Register link */
.register-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.register-link a {
  color: #23a6d5;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
    margin: 1rem;
    max-width: calc(100% - 2rem); /* 确保在小屏幕上有边距 */
  }
}
/* 其他样式保持与 Login.vue 相同 */
</style>