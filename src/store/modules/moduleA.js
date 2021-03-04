import { UPDATE_NAME } from "../mutation-types"

export default {
    state: {
        name: "zhangSan",
    },
    mutations: {
        [UPDATE_NAME](state, payload) {
            return state.name + payload;
        }
    },
    getters: {
        fullName(state) {
            return state,name + '11111';
        },
        fullName2(state, getters) {
            return getters.fullName + '2222';
        },
        fullName3(state, getters,rootState) {
            return getters.fullName2 + rootState.counter
        }
    },
    actions: {
        updateInfo(context) {
            setTimeout(() => {
                context.commit(UPDATE_NAME, wangWu);
            }, 1000);
        }
    }
}