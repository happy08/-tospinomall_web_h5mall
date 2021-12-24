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
    if (parseFloat(r) == 0) {
      return t.split('').reverse().join('');
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
  },

  // 图片压缩
  compressImg(file) {
    var fileSize = parseFloat(parseInt(file['size']) / 1024 / 1024).toFixed(2);
    var read = new FileReader();
    read.readAsDataURL(file);
    return new Promise(function(resolve, reject) {
      read.onload = function(e) {
        let img = new Image();
        img.src = e.target.result;
        img.onload = function() {
          // 默认按比例压缩
          let w = this.width;
          let h = this.height;
          let ration;
          if (w * h > 2000000) { // 压缩尺寸
            ration = Math.sqrt(w * h / 2000000);
            w /= ration;
            h /= ration;
          }
          // 生成canvas
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          let base64;
          // 创建属性节点
          canvas.setAttribute('width', w);
          canvas.setAttribute('height', h);
          ctx.drawImage(this, 0, 0, w, h);
          // 压缩像素
          if (fileSize < 1) {
            // 如果图片小于一兆 那么不执行压缩操作
            base64 = canvas.toDataURL(file['type'], 1);
          } else if (fileSize > 1 && fileSize < 3) {
            // 如果图片大于1M并且小于3M 那么压缩0.7
            base64 = canvas.toDataURL(file['type'], 0.6);
          } else {
            // 如果图片超过3M 那么压缩0.4
            base64 = canvas.toDataURL(file['type'], 0.4);
          }
          // 回调函数返回file的值（将base64编码转成file）
          resolve(base64);
        }
      }
    })
  },

  // 将base64图片转为blob格式
  convertBase64UrlToBlob (urlData) {
    let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }
};

Vue.prototype.$utils = utils;
