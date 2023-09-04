import { getRole } from '@/service/admin';
import type { IRole } from '@/types';
import { createStore } from 'vuex';
interface State {
  isPc: boolean;
  role: IRole;
}
const store = createStore<State>({
  state: {
    isPc: !navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ),
    role: 'normal',
  },
  mutations: {
    setUserRole(state, role) {
      state.role = role;
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
  },
});

export default store;
