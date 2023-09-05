import { getRole, getUserInfo } from '@/service/admin';
import type { IRole, IUser } from '@/types';
import { createStore } from 'vuex';
interface State {
  isPc: boolean;
  role: IRole;
  userInfo: IUser;
}
const store = createStore<State>({
  state: {
    isPc: !navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ),
    role: 'normal',
    userInfo: { uid: -1 },
  },
  mutations: {
    setUserRole(state, role) {
      state.role = role;
    },
    setUserInfo(state, info) {
      state.userInfo = info;
    },
  },
  actions: {
    getUserRole({ state, commit }, payload) {
      getRole().then((res: any) => {
        if (res.code === 'SUCCESS') {
          commit('setUserRole', res.data);
        }
      });
    },
    getUserInfoFunc({ state, commit }, payload) {
      getUserInfo().then((res: any) => {
        if (res.code === 'SUCCESS') {
          commit('setUserInfo', res.data);
        }
      });
    },
  },
});

export default store;
