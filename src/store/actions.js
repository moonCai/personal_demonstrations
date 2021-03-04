import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  // context: 上下文 （改变state的唯一途径是提交mutation）
  addCart(context, payload) {
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);

    if (oldProduct) {
      context.commit(ADD_COUNTER, oldProduct);
    } else {
      payload.count = 1;
      context.commit(ADD_TO_CART, payload)
    }
  },

  updateInfo(context, payload) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        context.commit("updateInfo", payload)
        resolve(payload);
      })
    })
  }

  // this.$store.dispatch("updateInfo", infos).then(res => {
  //   console.log("完成了提交");
  // })
}
