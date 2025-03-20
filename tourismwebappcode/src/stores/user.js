import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '../api/user'
import { useRouter } from 'vue-router'
import { useTokenStore } from './token'

export const useUserStore = defineStore('userInfo', () => {
    const router = useRouter()
    const tokenStore = useTokenStore()
    
    // 定义用户信息
    const info = ref({
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
    })
    
    // 设置用户信息
    const setInfo = (newInfo) => {
        info.value = { ...info.value, ...newInfo }
    }
    
    // 清除用户信息
    const removeInfo = () => {
        info.value = {
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
        }
    }

    // 获取用户信息
    const fetchUserInfo = async () => {
        if (!tokenStore.token) {
            console.log('未找到登录令牌，跳过获取用户信息')
            return null;
        }
        
        try {
            console.log('正在获取用户信息...')
            const res = await getUserInfo();
            console.log('获取到的用户信息:', res)
            
            if (res.code === 200) {
                setInfo(res.data);
                console.log('用户信息已更新:', info.value)
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('获取用户信息失败:', error)
            if (error.response?.status === 401) {
                tokenStore.removeToken();
                removeInfo();
                router.push('/login');
            }
            return null;
        }
    }
    
    return { 
        info, 
        setInfo, 
        removeInfo,
        fetchUserInfo
    }
})

export default useUserStore 