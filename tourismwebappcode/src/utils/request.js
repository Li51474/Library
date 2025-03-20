import axios from 'axios';
import router from '../router';
import { ElMessage } from 'element-plus'
import { useTokenStore } from '../stores/token'

// 创建 axios 实例
const instance = axios.create({ 
    baseURL: '/api',  // 改回使用 /api 前缀
    timeout: 10000,
    withCredentials: true
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        console.log('请求拦截器 - 令牌:', token ? token.substring(0, 20) + '...' : '未找到')
        
        if (token) {
            config.headers.Authorization = token;
            console.log('已添加认证头:', config.headers.Authorization.substring(0, 20) + '...')
            
            // 检查令牌是否过期
            const tokenExpires = localStorage.getItem('tokenExpires');
            if (tokenExpires) {
                console.log('令牌过期时间:', new Date(tokenExpires).toLocaleString())
                if (new Date(tokenExpires) < new Date()) {
                    console.log('令牌已过期')
                    const tokenStore = useTokenStore();
                    tokenStore.removeToken();
                    router.push('/login');
                    return Promise.reject('令牌已过期');
                }
            }
        }
        
        console.log('请求配置:', {
            接口: config.url,
            方法: config.method,
            基础URL: config.baseURL
        })
        
        return config;
    },
    error => {
        console.error('Request interceptor error:', error)
        ElMessage.error('请求发送失败，请检查网络连接');
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        console.log('Response data:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        })
        return response.data;
    },
    error => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message
        })
        
        if (error.response?.status === 401) {
            console.log('Token invalid, logging out')
            ElMessage({
                message: '登录已过期，请重新登录',
                type: 'error',
                duration: 1500
            });
            const tokenStore = useTokenStore();
            tokenStore.removeToken();
            router.push('/login');
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error:', error)
            ElMessage({
                message: '网络连接失败，请检查后端服务是否启动',
                type: 'error',
                duration: 1500
            });
        } else {
            console.error('Other error:', error)
            ElMessage({
                message: error.response?.data?.message || '服务异常',
                type: 'error',
                duration: 1500
            });
        }
        return Promise.reject(error);
    }
);

export default instance