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
        r = num.split('.')[1],
        t = '';
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
    }
    return t.split('').reverse().join('') + '.' + r;
  },
  //前置补0
  preZero(j) {
    if (j < 10) j = "0" + j;
    return j;
  },
  //标准时间转 yy-MM-dd
  formatStandardDate(val) {
    // if ((val + '').indexOf('T') === -1) {
    //   return val;
    // }
    const date = new Date(val);
    const y = date.getFullYear();
    const m = utils.preZero(date.getMonth() + 1);
    const d = utils.preZero(date.getDate());
    // const h = preZero(date.getHours())
    // const minute = preZero(date.getMinutes())
    // const second = preZero(date.getSeconds())
    return y + '-' + m + '-' + d; // + ' ' + h + ':' + minute + ':' + second
  }
};

Vue.prototype.$utils = utils;
