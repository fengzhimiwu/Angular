import {TaskItemState} from '@shared/AppEnums';
import {ColorConsts} from '@shared/AppConsts';
import {SubProjectDto} from '@shared/service-proxies/service-proxies';

// SubProject的各种操作工具
export class SubProjectStageHelper {
  static readonly stageCodeSplitString = '-';

  // 获取计算并存入SubProject构件的背景颜色
  static getBackgroundClass(subProject: SubProjectDto): string {
    if (subProject === null || subProject === undefined || subProject.stageCode === null) {
      return '';
    }
    if (subProject.isFinished) {
      return ColorConsts.inCompletingClass;
    }
    const stageCodes = subProject.stageCode.split(this.stageCodeSplitString);
    if (stageCodes[2] === (TaskItemState.Pending as number).toString()) {
      return ColorConsts.waitAssignmentClass;
    }
    for (let i = 4; i < stageCodes.length; i++) {
      if (+stageCodes[i] !== TaskItemState.Finished) {
        return ColorConsts.inProcessingClass;
      }
    }
    return ColorConsts.waitWorkshopClass;
  }
  // 计算并存入构件的进度
  static getProgress(subProject: SubProjectDto): number {
    if (subProject.stageCode === null) {
      return 0;
    }
    const stageCodes = subProject.stageCode.split(this.stageCodeSplitString);
    return parseInt(stageCodes[0], 0) * 100 / parseInt(stageCodes[1], 0);
  }
  // 判断构件本道工序是否完成
  static isCurrentStepFinished(subProject: SubProjectDto): boolean {
    if (subProject && subProject.stageCode) {
      const stageCodes = subProject.stageCode.split(this.stageCodeSplitString);
      for (let i = 4; i < stageCodes.length; i++) {
        // 如有一个0说明所有未完成
        if (stageCodes[i] === '0') {
          return false;
        }
      }
      // 如果都是1说明完成
      return true;
    }
    // 没有stageCode说明有问题
    throw new Error('subProject或stageCode为空，无法判断');
  }
}

/// <summary>
/// 阶段编号：当前工序优先级-最后工序优先级-是否分派完成-任务项数目-任务项1完成状态-任务项2完成状态
/// </summary>
/// <example>
/// 子项目正处于：1-9-1-2-1-0 即工序优先级1-最后9-已分派完-任务项数2-任务1完成-任务2未完成
/// </example>
