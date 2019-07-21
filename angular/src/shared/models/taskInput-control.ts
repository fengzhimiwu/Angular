import {TaskInputAutocompleteType, TaskInputControlType} from '@shared/AppEnums';

// 表格控件的实体类
export interface TaskInputControl {
  // checkbox label picture该项类型
  type?: TaskInputControlType;
  name?: string;
  value?: string;
  // 提示文字
  hint?: string;
  // number数值部分
  // 允许误差
  allowedError?: string;
  // 期望数值的个数
  expectedValNum?: number;
  // 数值的值
  numberVal?: string[];
  // selection搜索选择部分
  autocompleteType?: TaskInputAutocompleteType;
  options?: string[];
}
