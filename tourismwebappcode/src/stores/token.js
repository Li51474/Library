import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore('token', () => {
    // 从 localStorage 初始化 token
    const token = ref(localStorage.getItem('token') || '')

    const setToken = (newToken) => {
        console.log('Setting token:', newToken ? newToken.substring(0, 10) + '...' : 'null')
        token.value = newToken
        // 同时保存到 localStorage
        localStorage.setItem('token', newToken)
    }

    const removeToken = () => {
        console.log('Removing token')
        token.value = ''
        // 同时从 localStorage 移除
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpires')
    }

    return {
        token,
        setToken,
        removeToken
    }
}) 