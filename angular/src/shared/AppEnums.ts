import {IsTenantAvailableOutputState} from '@shared/service-proxies/service-proxies';

export class AppTenantAvailabilityState {
  static Available: number = IsTenantAvailableOutputState._1;
  static InActive: number = IsTenantAvailableOutputState._2;
  static NotFound: number = IsTenantAvailableOutputState._3;
}

// 表格的5个选项：选择、勾选、数值、标签(tip)、照片
export enum TaskInputControlType {
  selection,
  checkbox,
  number,
  label,
  picture,
}
// TaskInput的自动补全
export enum TaskInputAutocompleteType {
  provider,
  inventory,
  examination
}
// 文件的类型
export enum FileItemCategory {
  Others = 0,
  Project = 1,
  TaskItem = 2,
  KnowledgeBase = 3,
  BimModel = 4,
  TaskAssignment = 5,
  Message = 6,
  UserHead = 7,
  QrCode = 8, // A single data not in database
  QrCodesZip = 9, // A single data not in database
  HomeVideo = 10,
  StatementTemplate = 11,
  ExaminationReport = 12
}
// 工作项任务的状态
export enum TaskItemState {
  Finished = 1,
  Pending = 0
}
