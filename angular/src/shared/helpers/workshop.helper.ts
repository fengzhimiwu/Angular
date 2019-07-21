import {TaskItemState} from '@shared/AppEnums';
import {ColorConsts} from '@shared/AppConsts';
import {PedestalDto, SubProjectDto} from '@shared/service-proxies/service-proxies';

// 台座的一些工具
export class WorkshopHelper {
  // 返回SubProject所处于的状态。本方法是对状态码stageCode进行读取和判断
  static checkSubProjectState(item: PedestalDto) {
    if (item.subProject === undefined || item.subProject.stageCode === null) {
      return '';
    }
    if (item.subProject.isFinished) {
      return 'in-completing';
    }
    const stageCodes = item.subProject.stageCode.split('-');
    if (stageCodes[2] === (TaskItemState.Pending as number).toString()) {
      return 'wait-assignment';
    }
    for (let i = 4; i < stageCodes.length; i++) {
      if (+stageCodes[i] !== TaskItemState.Finished) {
        return 'in-processing';
      }
    }
    return 'wait-workshop';
  }
  // 计算台座编号
  static calculatePedestalNo(item: PedestalDto) {
    const no = item.code.slice(item.code.length - 5, item.code.length);
    return parseInt(no, 10);
  }
  // 返回台座类型
  static getTypeName(item: PedestalDto) {
    if (!item) {
      return '无台座信息';
    }
    switch (item.type) {
      case 'GJ': return '绑扎台' + item.code;
      case 'ZL': return '制梁台' + item.code;
      case 'CL': return '存梁台' + item.code;
    }
  }
}

/// <summary>
/// 阶段编号：当前工序优先级-最后工序优先级-是否分派完成-任务项数目-任务项1完成状态-任务项2完成状态
/// </summary>
/// <example>
/// 子项目正处于：1-9-1-2-1-0 即工序优先级1-最后9-已分派完-任务项数2-任务1完成-任务2未完成
/// </example>
