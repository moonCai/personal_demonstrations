export default {
  cartLength(state) {
    return state.cartList.length;
  },
  cartList(state) {
    return state.cartList()
  },
  // 超过20岁的人
  moreThan20th(state) {
    return state.students.filter(stu => stu.age > 20)
  },
  // 超过20岁的人数
  countOfPersonsMoreThan20th(state, getters) {
    return getters.moreThan20th.length
  },
  // 超过*岁的人（携带参数）
  moreThanSpecialAge(state) {
    return (age) => { 
      state.students.filter(stu => stu.age > age)
    }
  }
}

// import { mapGetters } from "vuex"

// computed: {
  // 语法一：
  // ...mapGetters(["cartLength", "cartList"])
  // 语法二：
  // ...mapGetters({
  //   length: "cartLength",
  //   list: "cartList"
//   })
// }
