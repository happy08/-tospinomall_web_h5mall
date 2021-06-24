import Vue from 'vue';

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
  },

  // 数字格式化
  numberFormat(num, n) { // num 数字, n 保留几位小数
    n = n > 0 && n <= 20 ? n : 2;
    num = parseFloat((num + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
    var l = num.split('.')[0].split('').reverse(),
        r = num.split('.')[1];
    t = '';
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
    }
    return t.split('').reverse().join('') + '.' + r;
  }
};

Vue.prototype.$utils = utils;
