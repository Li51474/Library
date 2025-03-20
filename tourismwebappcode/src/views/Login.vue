<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { login } from '../api/user';
import { useTokenStore } from '../stores/token';

const router = useRouter();
const userStore = useUserStore();
const tokenStore = useTokenStore();

// Form data
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

// Form validation
const usernameError = ref('');
const passwordError = ref('');
const isSubmitting = ref(false);

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
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
  try {
    isSubmitting.value = true;
    console.log('正在尝试登录，用户名:', username.value)
    
    const res = await login(username.value, password.value);
    console.log('登录响应:', {
      状态码: res.code,
      消息: res.message,
      令牌: res.data ? res.data.substring(0, 20) + '...' : null,
      时间戳: new Date(res.timestamp).toLocaleString()
    });
    
    if (res.code === 200) {
      console.log('登录成功，完整令牌:', res.data);
      const token = res.data;
      tokenStore.setToken(token);
      
      if (rememberMe.value) {
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        localStorage.setItem('tokenExpires', expires.toISOString());
        console.log('令牌过期时间设置为:', expires.toLocaleString())
      }
      
      // 检查令牌存储
      const storedToken = localStorage.getItem('token');
      console.log('localStorage 中的令牌:', storedToken ? storedToken.substring(0, 20) + '...' : null);
      console.log('Store 中的令牌:', tokenStore.token ? tokenStore.token.substring(0, 20) + '...' : null);
      
      console.log('正在获取用户信息...')
      await userStore.fetchUserInfo();
      
      console.log('跳转到图书馆页面')
      router.push('/library');
    } else {
      console.error('登录失败:', res.message)
      alert(res.message || '登录失败');
    }
  } catch (error) {
    console.error('登录错误:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('登录失败，请稍后重试');
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
    
    <!-- Login form card -->
    <div class="login-card">
      <h1>登录</h1>
      
      <form @submit.prevent="handleSubmit">
        <!-- username field -->
        <div class="form-group">
          <label for="username">用户名</label>
          <div class="input-wrapper">
            <i class="icon username-icon">✉️</i>
            <input 
              id="username" 
              type="username" 
              v-model="username" 
              placeholder="请输入用户名"
              :class="{ 'input-error': usernameError }"
            />
          </div>
          <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
        </div>
        
        <!-- Password field -->
        <div class="form-group">
          <div class="label-row">
            <label for="password">密码</label>
            <a href="#" class="forgot-password">忘记密码?</a>
          </div>
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
              @click="togglePasswordVisibility"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>
        
        <!-- Remember me checkbox -->
        <div class="remember-me">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe">
            <span class="checkmark"></span>
            记住我
          </label>
        </div>
        
        <!-- Submit button -->
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <!-- Register link -->
      <div class="register-link">
        还没有账户? <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  position: fixed; /* 改为fixed定位 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw; /* 使用视口宽度单位 */
  height: 100vh; /* 使用视口高度单位 */
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  z-index: -1;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 修改 .login-container 样式 */
.login-container {
  position: fixed; /* 改为fixed定位 */
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

/* Login card */
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin: 1rem; /* 添加边距，防止在小屏幕上贴边 */
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
</style>