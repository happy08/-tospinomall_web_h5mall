import Vue from "vue";

const utils = {
  //节流
  throttle(fn, delay) {
    let timer;
    return function() {
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay);
    };
  },

  //防抖
  debounce(fn, time) {
    let timer = null;
    return function() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.call(this, arguments);
      }, time);
    };
  }
};

Vue.prototype.$utils = utils;
