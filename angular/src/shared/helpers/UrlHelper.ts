import {AppConsts} from '@shared/AppConsts';

// abp框架自带，Url帮助工具
export class UrlHelper {
  /**
   * The URL requested, before initial routing.
   */
  static initialUrl = location.href;

  static setInitialUrl(href: string) {
    this.initialUrl = AppConsts.appBaseUrl + href;
  }

  static getQueryParameters(): any {
    return document.location.search.replace(/(^\?)/, '').split('&').map(function (n) {
      return n = n.split('='), this[n[0]] = n[1], this;
    }.bind({}))[0];
  }
}

function hexToRgb(hexCode) {
  const patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
  const matches = patt.exec(hexCode);
  return 'rgb(' + parseInt(matches[1], 16) + ',' + parseInt(matches[2], 16) + ',' + parseInt(matches[3], 16) + ')';
}

function hexToRgba(hexCode, opacity) {
  const patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
  const matches = patt.exec(hexCode);
  return 'rgba(' + parseInt(matches[1], 16) + ',' + parseInt(matches[2], 16) + ',' + parseInt(matches[3], 16) + ',' + opacity + ')';
}
