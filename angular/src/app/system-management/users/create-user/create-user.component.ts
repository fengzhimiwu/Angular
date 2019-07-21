import {
  Component,
  ViewChild,
  Injector,
  Output,
  EventEmitter,
  ElementRef,
  OnInit
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import {
  UserServiceProxy,
  CreateUserDto,
  RoleDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/components/app-component-base";
import { finalize } from "rxjs/operators";
import { FormControl, AbstractControl } from "@angular/forms";

@Component({
  selector: "create-user-modal",
  templateUrl: "./create-user.component.html"
})
export class CreateUserComponent extends AppComponentBase implements OnInit {
  @ViewChild("createUserModal") modal: ModalDirective;
  @ViewChild("modalContent") modalContent: ElementRef;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  user: CreateUserDto = null;
  roles: RoleDto[] = null;
  confirmedPasswordControl: FormControl;

  constructor(injector: Injector, private _userService: UserServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this._userService.getRoles().subscribe(result => {
      this.roles = result.items;
    });
  }

  show(): void {
    this.active = true;
    this.modal.show();
    this.user = new CreateUserDto();
    this.user.init({ isActive: true });
    // 用于做表格项名字的重复验证
    this.confirmedPasswordControl = new FormControl(
      '',
      (control: AbstractControl): { [key: string]: any } | null =>
        // 名字重复，且不是同一个input会报错
        this.user.password !== control.value
          ? { 'confirmedPasswordFail': { value: control.value } }
          : null
    );
  }

  onShown(): void {
    $.AdminBSB.input.activate($(this.modalContent.nativeElement));
  }

  save(): void {
    // TO/DO: Refactor this, don't use jQuery style code
    const roles = [];
    $(this.modalContent.nativeElement)
      .find("[name=role]")
      .each((ind: number, elem: Element) => {
        if ($(elem).is(":checked") === true) {
          roles.push(elem.getAttribute("value").valueOf());
        }
      });
    this.user.roleNames = roles;
    this.saving = true;
    // 填入暂不需要的信息，姓和电子邮件
    this.user.surname = this.user.name[0];
    this.user.emailAddress =
      this.user.name + this.user.mobileNumber + "@email.com";
    // 创建用户的api
    this._userService
      .create(this.user)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.snackBar.open(this.l("保存成功"), "关闭", { duration: 2000 });
        this.close();
        this.modalSave.emit(null);
      });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
