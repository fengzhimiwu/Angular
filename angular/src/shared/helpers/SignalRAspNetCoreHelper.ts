import {AbpEventNames, AppConsts} from '@shared/AppConsts';
import {UtilsService} from '@abp/utils/utils.service';

// SignalR连接工具
export class SignalRAspNetCoreHelper {
  static initSignalR(): void {
    // abp框架自带配置，最好不要随意修改
    const encryptedAuthToken = new UtilsService().getCookieValue(AppConsts.authorization.encrptedAuthTokenName);
    abp.signalr = {
      autoConnect: true,
      connect: undefined,
      hubs: undefined,
      qs: AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken),
      remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
      startConnection: undefined,
      url: '/signalr'
    };
    // 通知signalr注册
    jQuery.getScript('/assets/abp/abp.signalr-client.js').then(() => {
      // 聊天signalr
      SignalRAspNetCoreHelper.initMessageSystem();
    });
  }
  // 通讯系统初始化
  static initMessageSystem() {
    abp.signalr.startConnection(abp.appPath + 'signalrMessage', function (connection) {
      // Save a reference to the hub
      abp.signalr.hubs.message = connection;
      // 监听getMessage，触发app.message.messageReceived方法
      connection.on('getMessage', message => {
        console.log(message);
        // 触发系统的总线事件
        abp.event.trigger(AbpEventNames.messageReceived, message);
      });
      // 当链接断开的时候
      connection.onclose(() => {
        console.log('你断开了连接');
        abp.event.trigger(AbpEventNames.connectionStateChange, false);
      });
    }).then(function () {
      // 连接服务器成功
      abp.event.trigger(AbpEventNames.connectionStateChange, true);
      // abp.log.debug('Connected to MessageSystem server!');
    });
  }
}
