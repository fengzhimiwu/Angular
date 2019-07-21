import { Pipe, PipeTransform } from '@angular/core';
import * as moment from '@node_modules/moment';

// 未使用 自定义管道，用于简化服务器时间
@Pipe({
  name: 'simpleDate',
  pure: true
})
export class SimpleDatePipe implements PipeTransform {

  transform(value: moment.Moment, args?: any): any {
    if (Math.abs(value.diff(moment(), 'd', true)) > 7) {
      return value.format('YY-MM-DD ');
    } else {
      value.fromNow();
    }
  }
}
