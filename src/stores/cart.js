import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCartListApi } from '@/apis/cart'

export const useCartStore = defineStore(
  'cart',
  () => {
    const cartList = ref([])
    const getCartList = async () => {
      try {
        const res = await getCartListApi()
        cartList.value = res.data.result
      } catch {
        // 错误提示已由响应拦截器处理
      }
    }
    return { cartList, getCartList }
  },
  { persist: true }
)
