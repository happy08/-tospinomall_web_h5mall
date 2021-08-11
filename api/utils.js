/**
 * 获取cookie值
 */
export function getCookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return decodeURIComponent(c.substring(name.length, c.length));
  }
  return '';
}

/**
 * 设置cookie值
 */
export function setCookie(cname, cvalue, exdays){
  // var d = new Date();
  // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  // var expires = 'expires=' + d.toGMTString();
  // document.cookie = cname + '=' + cvalue + '; ' + expires;
  if (process.client) {
    document.cookie = cname + '=' + cvalue + '; ';
  }
  
}