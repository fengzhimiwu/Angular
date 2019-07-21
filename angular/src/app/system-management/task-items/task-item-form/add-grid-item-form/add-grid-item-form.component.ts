import {Component, Inject, OnInit} from '@angular/core';
import {TaskInputAutocompleteType, TaskInputControlType} from '@shared/AppEnums';
import {TaskInputControl} from '@shared/models/taskInput-control';
import {MAT_DIALOG_DATA, MatDialogRef} from '@node_modules/@angular/material';
import {AbstractControl, FormControl} from '@node_modules/@angular/forms';

@Component({
  selector: 'app-add-grid-item-form',
  templateUrl: './add-grid-item-form.component.html',
  styleUrls: ['./add-grid-item-form.component.css']
})
export class AddGridItemFormComponent implements OnInit {
  TaskInputControlType = TaskInputControlType;
  TaskInputAutocompleteType = TaskInputAutocompleteType;
  nameControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<AddGridItemFormComponent>,
    // 传入的数据
    @Inject(MAT_DIALOG_DATA) public data: {
      selectedFormItem: TaskInputControl,
      formItems: TaskInputControl[]
    }
  ) {
  }

  ngOnInit(): void {
    // 用于做表格项名字的重复验证
    this.nameControl = new FormControl(this.data.selectedFormItem.name,
      (control: AbstractControl): { [key: string]: any } | null =>
      // 名字重复，且不是同一个input会报错
      this.data.formItems.some(v => v.name === control.value && v !== this.data.selectedFormItem) ?
          {'duplicatedName': {value: control.value}} : null
    );
    this.nameControl.valueChanges.subscribe((value => this.data.selectedFormItem.name = value));
  }

  // 如果dialog可以关闭说明没问题
  onNoClick() {
    if (!this.nameControl.value) {
      this.dialogRef.close(this.data.selectedFormItem);
    } else {
      this.dialogRef.close();
    }
  }
}
