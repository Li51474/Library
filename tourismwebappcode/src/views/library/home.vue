<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import { useTokenStore } from '../../stores/token';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const tokenStore = useTokenStore();
const router = useRouter();

// User information - 使用 store 中的用户信息
const user = computed(() => userStore.info);

// Search functionality
const searchQuery = ref('');
const isSearchFocused = ref(false);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索图书:', searchQuery.value);
    // In a real app, you would redirect to search results page or fetch results
  }
};

// Categories
const categories = ref([
  { id: 1, name: '小说文学', icon: '📚', count: 1245 },
  { id: 2, name: '科技计算机', icon: '💻', count: 876 },
  { id: 3, name: '历史文化', icon: '🏛️', count: 654 },
  { id: 4, name: '经济管理', icon: '📊', count: 432 },
  { id: 5, name: '艺术设计', icon: '🎨', count: 321 },
  { id: 6, name: '教育学习', icon: '🎓', count: 543 },
  { id: 7, name: '生活健康', icon: '🍎', count: 765 },
  { id: 8, name: '科学自然', icon: '🔬', count: 432 }
]);

// New books
const newBooks = ref([
  {
    id: 1,
    title: '人工智能与未来社会',
    author: '李明',
    cover: '/placeholder.svg?height=280&width=180',
    publishDate: '2023-03-15',
    category: '科技计算机',
    available: true
  },
  {
    id: 2,
    title: '数据结构与算法分析',
    author: '王刚',
    cover: '/placeholder.svg?height=280&width=180',
    publishDate: '2023-03-10',
    category: '科技计算机',
    available: true
  },
  {
    id: 3,
    title: '中国古代文化史',
    author: '张华',
    cover: '/placeholder.svg?height=280&width=180',
    publishDate: '2023-03-05',
    category: '历史文化',
    available: false
  },
  {
    id: 4,
    title: '现代管理学原理',
    author: '刘强',
    cover: '/placeholder.svg?height=280&width=180',
    publishDate: '2023-03-01',
    category: '经济管理',
    available: true
  },
  {
    id: 5,
    title: '艺术设计思维',
    author: '陈艺',
    cover: '/placeholder.svg?height=280&width=180',
    publishDate: '2023-02-28',
    category: '艺术设计',
    available: true
  }
]);

// Popular books
const popularBooks = ref([
  {
    id: 6,
    title: '深度学习实战',
    author: '张智',
    cover: '/placeholder.svg?height=280&width=180',
    rating: 4.9,
    borrowCount: 156,
    category: '科技计算机',
    available: true
  },
  {
    id: 7,
    title: '经济学原理',
    author: '王经',
    cover: '/placeholder.svg?height=280&width=180',
    rating: 4.8,
    borrowCount: 142,
    category: '经济管理',
    available: false
  },
  {
    id: 8,
    title: '心理学与生活',
    author: '李心',
    cover: '/placeholder.svg?height=280&width=180',
    rating: 4.7,
    borrowCount: 135,
    category: '生活健康',
    available: true
  },
  {
    id: 9,
    title: '世界历史简明读本',
    author: '吴史',
    cover: '/placeholder.svg?height=280&width=180',
    rating: 4.6,
    borrowCount: 128,
    category: '历史文化',
    available: true
  }
]);

// Borrowing rankings
const borrowingRankings = ref([
  {
    id: 10,
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    cover: '/placeholder.svg?height=280&width=180',
    borrowCount: 289,
    category: '历史文化'
  },
  {
    id: 11,
    title: '原则',
    author: '雷·达里奥',
    cover: '/placeholder.svg?height=280&width=180',
    borrowCount: 267,
    category: '经济管理'
  },
  {
    id: 12,
    title: '时间简史',
    author: '史蒂芬·霍金',
    cover: '/placeholder.svg?height=280&width=180',
    borrowCount: 245,
    category: '科学自然'
  },
  {
    id: 13,
    title: '三体',
    author: '刘慈欣',
    cover: '/placeholder.svg?height=280&width=180',
    borrowCount: 234,
    category: '小说文学'
  },
  {
    id: 14,
    title: '活着',
    author: '余华',
    cover: '/placeholder.svg?height=280&width=180',
    borrowCount: 212,
    category: '小说文学'
  }
]);

// Mobile menu state
const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Notifications
const notifications = ref([
  { id: 1, message: '您借阅的《数据结构》将在3天后到期', time: '2小时前', read: false },
  { id: 2, message: '您预约的《人工智能导论》已到馆', time: '1天前', read: true },
  { id: 3, message: '系统将于本周六进行维护升级', time: '2天前', read: true }
]);

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

const isNotificationDropdownOpen = ref(false);
const toggleNotificationDropdown = () => {
  isNotificationDropdownOpen.value = !isNotificationDropdownOpen.value;
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Component lifecycle
onMounted(async () => {
  // 获取用户信息
  await userStore.fetchUserInfo();
  console.log('Home page component mounted');
  // In a real app, you would fetch data from APIs here
});

const logout = () => {
  tokenStore.removeToken();
  router.push('/login');
};
</script>

<template>
  <div class="library-home">
    <!-- 头部导航 -->
    <header class="header">
      <div class="header-container">
        <div class="logo-container">
          <div class="logo">📚 智慧图书馆</div>
          <button class="mobile-menu-button" @click="toggleMobileMenu">
            <span v-if="isMobileMenuOpen">✕</span>
            <span v-else>☰</span>
          </button>
        </div>
        
        <nav class="main-nav" :class="{ 'mobile-open': isMobileMenuOpen }">
          <ul class="nav-links">
            <li><a href="#" class="active">首页</a></li>
            <li><a href="#">图书馆藏</a></li>
            <li><a href="#">我的借阅</a></li>
            <li><a href="#">预约服务</a></li>
          </ul>
        </nav>

        <div class="user-actions">
          <div class="notification-dropdown">
            <button @click="toggleNotificationDropdown">
              🔔
              <span v-if="unreadNotificationsCount" class="notification-badge">
                {{ unreadNotificationsCount }}
              </span>
            </button>
          </div>
          
          <div class="user-info" v-if="user">
            <router-link :to="{ path: '/user' }">
            <img :src="user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'" 
                 :alt="user.name" 
                 class="user-avatar">
            <span class="user-name">{{ user.name || '未设置昵称' }}</span>
          </router-link>
          </div>
          <div class="user-info" v-else>
            <span class="user-name">加载中...</span>
          </div>
          <button @click="logout" class="logout-button">
            退出登录
          </button>
          
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-box" :class="{ 'focused': isSearchFocused }">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索图书..."
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch">🔍</button>
        </div>
      </div>

      <!-- 分类导航 -->
      <section class="categories-section">
        <h2>图书分类</h2>
        <div class="categories-grid">
          <div v-for="category in categories" :key="category.id" class="category-card">
            <span class="category-icon">{{ category.icon }}</span>
            <h3>{{ category.name }}</h3>
            <p>{{ category.count }} 本图书</p>
          </div>
        </div>
      </section>

      <!-- 新书推荐 -->
      <section class="new-books-section">
        <h2>新书推荐</h2>
        <div class="books-grid">
          <div v-for="book in newBooks" :key="book.id" class="book-card">
            <img :src="book.cover" :alt="book.title">
            <div class="book-info">
              <h3>{{ book.title }}</h3>
              <p class="author">{{ book.author }}</p>
              <p class="category">{{ book.category }}</p>
              <p class="date">{{ formatDate(book.publishDate) }}</p>
              <span :class="['status', book.available ? 'available' : 'borrowed']">
                {{ book.available ? '可借阅' : '已借出' }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 热门图书 -->
      <section class="popular-books-section">
        <h2>热门图书</h2>
        <div class="books-grid">
          <div v-for="book in popularBooks" :key="book.id" class="book-card">
            <img :src="book.cover" :alt="book.title">
            <div class="book-info">
              <h3>{{ book.title }}</h3>
              <p class="author">{{ book.author }}</p>
              <p class="category">{{ book.category }}</p>
              <p class="borrow-count">借阅次数: {{ book.borrowCount }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.library-home {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-left: 1rem;
}

.main-nav {
  display: flex;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-links a.active,
.nav-links a:hover {
  color: var(--primary-color);
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notification-dropdown {
  position: relative;
}

.notification-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  position: relative;
  color: var(--text-light);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--error-color);
  color: white;
  font-size: 0.75rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 1rem;
  margin-top: 0.5rem;
  z-index: 10;
}

.dropdown-content h3 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: var(--text-color);
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--gray-200);
}

.notification-list li:last-child {
  border-bottom: none;
}

.notification-list li.unread {
  background-color: rgba(58, 110, 165, 0.05);
}

.notification-message {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.8rem;
  color: var(--text-lighter);
}

.dropdown-footer {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
}

.dropdown-footer a {
  color: var(--primary-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: none;
}

.user-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.8rem;
  color: var(--text-lighter);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: var(--white);
  padding: 3rem 1rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  border-radius: 50px;
  background-color: var(--white);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s, box-shadow 0.3s;
}

.search-container.focused {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.search-container input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-button {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  padding: 0 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #e0a61b;
}

.search-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
}

.tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  transition: background-color 0.3s;
}

.tag:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Categories Section */
.categories-section {
  padding: 3rem 1rem;
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--text-color);
}

.view-all {
  color: var(--primary-color);
  font-size: 0.95rem;
  font-weight: 500;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.category-card {
  display: flex;
  align-items: center;
  background-color: var(--white);
  padding: 1.25rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s, box-shadow 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.category-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.category-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.category-info p {
  font-size: 0.9rem;
  color: var(--text-lighter);
}

/* Main Content */
.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

/* Books Sections */
.books-section {
  margin-bottom: 3rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.book-card {
  background-color: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.book-cover-container {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.book-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.book-status.available {
  background-color: var(--success-color);
  color: white;
}

.book-status.unavailable {
  background-color: var(--gray-300);
  color: var(--text-color);
}

.book-info {
  padding: 1.25rem;
}

.book-title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-lighter);
  margin-bottom: 1rem;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.stars {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.rating-value {
  font-size: 0.9rem;
  font-weight: 500;
}

.borrow-button {
  width: 100%;
  padding: 0.6rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s;
}

.borrow-button:hover {
  background-color: var(--primary-dark);
}

.borrow-button:disabled {
  background-color: var(--gray-300);
  cursor: not-allowed;
}

/* Rankings Section */
.rankings-section {
  margin-bottom: 3rem;
}

.rankings-list {
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
  transition: background-color 0.3s;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-item:hover {
  background-color: var(--gray-100);
}

.ranking-number {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.rank-1 {
  background-color: gold;
  color: var(--text-color);
}

.rank-2 {
  background-color: silver;
  color: var(--text-color);
}

.rank-3 {
  background-color: #cd7f32; /* bronze */
  color: white;
}

.ranking-cover {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.ranking-info {
  flex: 1;
}

.ranking-title {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.ranking-author {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.ranking-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-lighter);
}

/* Footer */
.footer {
  background-color: var(--primary-dark);
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  position: relative;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: var(--secondary-color);
}

.footer-section ul {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s;
}

.footer-section a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: background-color 0.3s;
}

.social-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.footer-section p {
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.footer-bottom {
  background-color: rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .mobile-menu-button {
    display: block;
  }
  
  .main-nav {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background-color: var(--white);
    box-shadow: var(--shadow);
    padding: 1rem;
    display: none;
  }
  
  .main-nav.mobile-open {
    display: block;
  }
  
  .nav-links {
    flex-direction: column;
    gap: 0;
  }
  
  .nav-links a {
    display: block;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--gray-200);
  }
  
  .nav-links li:last-child a {
    border-bottom: none;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .user-info {
    display: none;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .search-button .search-text {
    display: none;
  }
  
  .dropdown-content {
    width: 280px;
  }
}

@media (min-width: 768px) {
  .user-info {
    display: block;
  }
}
</style>