import { createStore } from 'vuex';
interface State {
  isPc: boolean;
}
const store = createStore<State>({
  state() {
    return {
      isPc: !navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      ),
    };
  },
});

export default store;
