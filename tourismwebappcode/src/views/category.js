import request from '../utils/request'

// 获取分类列表
export const getCategoryListService = () => {
    console.log('开始获取分类列表')
    return request.get('/category', {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log('分类列表响应：', res)
        return res
    }).catch(err => {
        console.error('获取分类列表错误：', err)
        throw err
    })
}

// 添加分类
export const addCategoryService = (categoryData) => {
    console.log('添加分类请求参数：', categoryData)
    return request.post('/category', categoryData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log('添加分类响应：', res)
        return res
    }).catch(err => {
        console.error('添加分类错误：', err)
        throw err
    })
}

// 更新分类
export const updateCategoryService = (categoryData) => {
    console.log('更新分类请求参数：', categoryData)
    return request.put('/category', categoryData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log('更新分类响应：', res)
        return res
    }).catch(err => {
        console.error('更新分类错误：', err)
        throw err
    })
}

// 删除分类
export const deleteCategoryService = (id) => {
    const params = new URLSearchParams()
    params.append('id', id)

    return request.delete('/category', {
        params: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}