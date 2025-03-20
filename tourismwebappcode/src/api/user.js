import request from '../utils/request';

// 登录接口
export const login = (username, password) => {
    return request.post('/user/login', { username, password });
}

// 注册接口
export const register = (username, password, email) => {
    return request.post('/user/register', { 
        username, 
        password,
        email 
    });
}

// 获取用户信息
export const getUserInfo = () => {
    // 从 token 中解析用户 ID
    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject(new Error('未找到登录令牌'));
    }
    
    try {
        // 解析 JWT token 获取用户信息
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        console.log('从令牌中解析出的用户信息:', payload);
        
        // 使用 token 中的用户 ID 获取详细信息
        return request.get(`/user/${payload.id}`);
    } catch (error) {
        console.error('解析令牌失败:', error);
        return Promise.reject(error);
    }
}

// 修改用户信息
export const updateUserInfo = (data) => {
    return request.put(`/user/${data.userId}`, {
        email: data.email,
        phoneNumber: data.phone,
        name: data.name,
        bio: data.bio
    });
}

// 修改密码
export const updatePassword = (data) => {
    return request.put('/user/password', {
        oldPwd: data.oldPassword,
        newPwd: data.newPassword,
        rePwd: data.confirmPassword
    });
}

// 删除用户
export const deleteUser = (userId) => {
    return request.delete(`/user/${userId}`);
}