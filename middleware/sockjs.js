import * as SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';

export default ({ app, store }) => {
  if (!store.state.user.authToken || !process.client) {
    return false;
  }
  // 建立连接对象
  let socket = new SockJS(store.state.user.websocketMsg.address + store.state.user.websocketMsg.webSocketUrl); // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
  // 获取STOMP子协议的客户端对象
  console.log(socket)
  let stompClient = Stomp.over(socket);
  stompClient.debug = null;

  let connection = function () {
    const token = store.state.user.authToken;
      const headers = {
        'TENANT-ID': '1',
        'Authorization': token
      }
      
      // 向服务器发起websocket连接
      stompClient.connect(headers, () => {
        console.log('---------------')
        // 订阅通道  /task/租户ID/用户名称/remind
        let target = store.state.user.websocketMsg.subscribeUrl;

        stompClient.subscribe(target, (msg) => { // 订阅服务端提供的某个topic;
          console.log('++++++++++++++++++++++++++')
          console.log(msg);
          store.commit('user/SET_ISNEWMESSAGE', true); // 消息订阅成功提示小红点
        })
      }, (err) => {
        console.log('==========');
        console.log(err);
      })
  }

  let initWebSocket = function () {
    connection();
    // 断开重连机制,尝试发送消息,捕获异常发生时重连
    let timer = setInterval(() => {
      if (!store.state.user.authToken) {
        clearInterval(timer);
      }
      try {
        stompClient.send('test');
        console.log("test===============");
      } catch (err) {
        console.log('断线了: ' + err);
        connection();
      }
    }, 5000)
  }

  if (store.state.user.authToken) {
    initWebSocket(); // 消息
  }
}