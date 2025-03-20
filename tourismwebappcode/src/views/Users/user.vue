<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import { useTokenStore } from '../../stores/token';
import { updateUserInfo, updatePassword, deleteUser } from '../../api/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const tokenStore = useTokenStore();
const router = useRouter();

// User data - 使用 store 中的用户信息
const user = computed(() => userStore.info);

// User data with reactive state
const userData = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  bio: '',
  role: '普通用户',
  borrowedCount: 0,
  created_at: '',
  updated_at: ''
});

// Form visibility states
const showUpdateProfileForm = ref(false);
const showUpdatePasswordForm = ref(false);
const showDeleteConfirmation = ref(false);

// Form data
const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  bio: ''
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const deleteForm = reactive({
  password: '',
  confirmText: ''
});

// Form errors
const profileErrors = ref({});
const passwordErrors = ref({});
const deleteErrors = ref({});

// Status messages
const statusMessage = ref('');
const statusType = ref(''); // 'success' or 'error'

// Initialize profile form with user data
const initProfileForm = () => {
  const currentUser = user.value;
  profileForm.name = currentUser.name || '';
  profileForm.email = currentUser.email || '';
  profileForm.phone = currentUser.phone || '';
  profileForm.bio = currentUser.bio || '';
};

// Toggle forms
const toggleUpdateProfile = () => {
  showUpdateProfileForm.value = !showUpdateProfileForm.value;
  if (showUpdateProfileForm.value) {
    initProfileForm();
    showUpdatePasswordForm.value = false;
    showDeleteConfirmation.value = false;
  }
  profileErrors.value = {};
};

const toggleUpdatePassword = () => {
  showUpdatePasswordForm.value = !showUpdatePasswordForm.value;
  if (showUpdatePasswordForm.value) {
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    showUpdateProfileForm.value = false;
    showDeleteConfirmation.value = false;
  }
  passwordErrors.value = {};
};

const toggleDeleteConfirmation = () => {
  showDeleteConfirmation.value = !showDeleteConfirmation.value;
  if (showDeleteConfirmation.value) {
    deleteForm.password = '';
    deleteForm.confirmText = '';
    showUpdateProfileForm.value = false;
    showUpdatePasswordForm.value = false;
  }
  deleteErrors.value = {};
};

// Form submission handlers
const updateProfile = async () => {
  // Reset errors
  profileErrors.value = {};
  
  // Validate form
  let isValid = true;
  
  if (!profileForm.name.trim()) {
    profileErrors.value.name = '请输入姓名';
    isValid = false;
  }
  
  if (!profileForm.email.trim()) {
    profileErrors.value.email = '请输入邮箱';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(profileForm.email)) {
    profileErrors.value.email = '请输入有效的邮箱地址';
    isValid = false;
  }
  
  if (!isValid) return;
  
  try {
    // 调用更新接口
    const res = await updateUserInfo({
      userId: user.value.id,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      bio: profileForm.bio
    });
    
    if (res.code === 200) {
      // 更新成功，重新获取用户信息
      await userStore.fetchUserInfo();
      
      // Show success message
      statusMessage.value = '个人信息更新成功！';
      statusType.value = 'success';
      
      // Close form
      showUpdateProfileForm.value = false;
    } else {
      throw new Error(res.message || '更新失败');
    }
  } catch (error) {
    console.error('更新失败:', error);
    statusMessage.value = error.message || '更新失败，请稍后再试';
    statusType.value = 'error';
  }
  
  // Clear status message after 3 seconds
  setTimeout(() => {
    statusMessage.value = '';
  }, 3000);
};

const updateUserPassword = async () => {
  // Reset errors
  passwordErrors.value = {};
  
  // Validate form
  let isValid = true;
  
  if (!passwordForm.currentPassword) {
    passwordErrors.value.currentPassword = '请输入当前密码';
    isValid = false;
  }
  
  if (!passwordForm.newPassword) {
    passwordErrors.value.newPassword = '请输入新密码';
    isValid = false;
  } else if (passwordForm.newPassword.length < 6) {
    passwordErrors.value.newPassword = '密码长度至少为6位';
    isValid = false;
  }
  
  if (!passwordForm.confirmPassword) {
    passwordErrors.value.confirmPassword = '请确认新密码';
    isValid = false;
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.value.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }
  
  if (!isValid) return;
  
  try {
    console.log('正在更新密码，参数：', {
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword
    });
    
    // 调用修改密码接口
    const res = await updatePassword({
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword
    });
    
    if (res.code === 200) {
      // Show success message
      statusMessage.value = '密码更新成功！';
      statusType.value = 'success';
      
      // Clear form and close
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
      showUpdatePasswordForm.value = false;
      
      // 可选：退出登录，要求用户重新登录
      tokenStore.removeToken();
      router.push('/login');
    } else {
      throw new Error(res.message || '修改密码失败');
    }
  } catch (error) {
    console.error('修改密码失败:', error);
    statusMessage.value = error.message || '修改密码失败，请稍后再试';
    statusType.value = 'error';
  }
  
  // Clear status message after 3 seconds
  setTimeout(() => {
    statusMessage.value = '';
  }, 3000);
};

const deleteUserAccount = async () => {
  // Reset errors
  deleteErrors.value = {};
  
  // Validate form
  let isValid = true;
  
  if (!deleteForm.password) {
    deleteErrors.value.password = '请输入密码';
    isValid = false;
  }
  
  if (!deleteForm.confirmText || deleteForm.confirmText !== '删除账户') {
    deleteErrors.value.confirmText = '请输入"删除账户"以确认';
    isValid = false;
  }
  
  if (!isValid) return;
  
  try {
    // 调用删除账户接口
    const res = await deleteUser(user.value.id);
    
    if (res.code === 200) {
      // 清除用户信息和 token
      userStore.clearToken();
      
      // 跳转到登录页
      router.push('/login');
    } else {
      throw new Error(res.message || '删除账户失败');
    }
  } catch (error) {
    console.error('删除账户失败:', error);
    statusMessage.value = error.message || '删除账户失败，请稍后再试';
    statusType.value = 'error';
  }
};

// Initialize component
onMounted(async () => {
  console.log('用户页面加载');
  await userStore.fetchUserInfo();
  initProfileForm();
});
</script>

<template>
  <div class="user-profile" v-if="user">
    <!-- Status message -->
    <div v-if="statusMessage" :class="['status-message', statusType]">
      {{ statusMessage }}
    </div>
    
    <!-- User info section -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-container">
          <img :src="user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'" :alt="user.name" class="avatar">
        </div>
        <div class="user-info">
          <h2>{{ user.name || '未设置昵称' }}</h2>
          <p class="role">{{ user.role || '普通用户' }}</p>
          <p class="borrowed-count">已借阅: {{ user.borrowedCount || 0 }} 本</p>
        </div>
      </div>
      
      <div class="bio-section">
        <h3>个人简介</h3>
        <p>{{ user.bio || '暂无个人简介' }}</p>
      </div>
      
      <div class="action-buttons">
        <button @click="toggleUpdateProfile" class="btn btn-primary">
          {{ showUpdateProfileForm ? '取消' : '更新个人信息' }}
        </button>
        <button @click="toggleUpdatePassword" class="btn btn-secondary">
          {{ showUpdatePasswordForm ? '取消' : '修改密码' }}
        </button>
        <button @click="toggleDeleteConfirmation" class="btn btn-danger">
          {{ showDeleteConfirmation ? '取消' : '删除账户' }}
        </button>
      </div>
    </div>
    
    <!-- Update profile form -->
    <div v-if="showUpdateProfileForm" class="form-card">
      <h2>更新个人信息</h2>
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="name">姓名</label>
          <input 
            id="name" 
            v-model="profileForm.name" 
            type="text" 
            :class="{ 'input-error': profileErrors.name }"
          />
          <span v-if="profileErrors.name" class="error-message">{{ profileErrors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="email">邮箱</label>
          <input 
            id="email" 
            v-model="profileForm.email" 
            type="email" 
            :class="{ 'input-error': profileErrors.email }"
          />
          <span v-if="profileErrors.email" class="error-message">{{ profileErrors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="phone">电话</label>
          <input id="phone" v-model="profileForm.phone" type="tel" />
        </div>
        
        <div class="form-group">
          <label for="bio">个人简介</label>
          <textarea id="bio" v-model="profileForm.bio" rows="4"></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">保存更改</button>
          <button type="button" @click="toggleUpdateProfile" class="btn btn-outline">取消</button>
        </div>
      </form>
    </div>
    
    <!-- Update password form -->
    <div v-if="showUpdatePasswordForm" class="form-card">
      <h2>修改密码</h2>
      <form @submit.prevent="updateUserPassword">
        <div class="form-group">
          <label for="current-password">当前密码</label>
          <input 
            id="current-password" 
            v-model="passwordForm.currentPassword" 
            type="password" 
            :class="{ 'input-error': passwordErrors.currentPassword }"
          />
          <span v-if="passwordErrors.currentPassword" class="error-message">
            {{ passwordErrors.currentPassword }}
          </span>
        </div>
        
        <div class="form-group">
          <label for="new-password">新密码</label>
          <input 
            id="new-password" 
            v-model="passwordForm.newPassword" 
            type="password" 
            :class="{ 'input-error': passwordErrors.newPassword }"
          />
          <span v-if="passwordErrors.newPassword" class="error-message">
            {{ passwordErrors.newPassword }}
          </span>
        </div>
        
        <div class="form-group">
          <label for="confirm-password">确认新密码</label>
          <input 
            id="confirm-password" 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            :class="{ 'input-error': passwordErrors.confirmPassword }"
          />
          <span v-if="passwordErrors.confirmPassword" class="error-message">
            {{ passwordErrors.confirmPassword }}
          </span>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">更新密码</button>
          <button type="button" @click="toggleUpdatePassword" class="btn btn-outline">取消</button>
        </div>
      </form>
    </div>
    
    <!-- Delete account confirmation -->
    <div v-if="showDeleteConfirmation" class="form-card danger-zone">
      <h2>删除账户</h2>
      <div class="warning-box">
        <p><strong>警告：</strong>此操作无法撤销。这将永久删除您的账户和所有相关数据。</p>
      </div>
      
      <form @submit.prevent="deleteUserAccount">
        <div class="form-group">
          <label for="delete-password">请输入您的密码</label>
          <input 
            id="delete-password" 
            v-model="deleteForm.password" 
            type="password" 
            :class="{ 'input-error': deleteErrors.password }"
          />
          <span v-if="deleteErrors.password" class="error-message">
            {{ deleteErrors.password }}
          </span>
        </div>
        
        <div class="form-group">
          <label for="confirm-delete">请输入"删除账户"以确认</label>
          <input 
            id="confirm-delete" 
            v-model="deleteForm.confirmText" 
            type="text" 
            :class="{ 'input-error': deleteErrors.confirmText }"
          />
          <span v-if="deleteErrors.confirmText" class="error-message">
            {{ deleteErrors.confirmText }}
          </span>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-danger">永久删除账户</button>
          <button type="button" @click="toggleDeleteConfirmation" class="btn btn-outline">取消</button>
        </div>
      </form>
    </div>
  </div>
  <div v-else class="loading">
    加载中...
  </div>
</template>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Status message */
.status-message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

.success {
  background-color: #e6f7e6;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

/* Cards */
.profile-card, .form-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
}

/* Profile header */
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar-container {
  margin-right: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.user-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: #333;
}

.user-info .role {
  margin: 0.25rem 0;
}

.user-info .borrowed-count {
  margin: 0.25rem 0;
}

/* Bio section */
.bio-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.bio-section h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  color: #333;
}

.bio-section p {
  margin: 0;
  color: #555;
  line-height: 1.6;
}

/* Action buttons */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Forms */
.form-card h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.input-error {
  border-color: #e53935;
}

.error-message {
  display: block;
  color: #e53935;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

/* Danger zone */
.danger-zone {
  border: 1px solid #ffcdd2;
}

.warning-box {
  background-color: #ffebee;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.warning-box p {
  margin: 0;
  color: #c62828;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background-color: #3a7bc8;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: #e53935;
  color: white;
}

.btn-danger:hover {
  background-color: #c62828;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #666;
}

.btn-outline:hover {
  background-color: #f5f5f5;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

/* New styles */
.role {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.borrowed-count {
  color: #23a6d5;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.2rem;
  color: #666;
}
</style>