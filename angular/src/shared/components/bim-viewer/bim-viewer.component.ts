import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation
} from '@angular/core';
import {AppConsts} from '@shared/AppConsts';
import {BiaViewerModels} from '@shared/models/bia-viewer-models';
import {BimModelDto, GetBimModelDbIdsOutput, ProjectDto, ProjectServiceProxy} from '@shared/service-proxies/service-proxies';
import '../../../assets/lib-forge/viewer3D';
declare var Autodesk: any;
import * as THREE from 'three';

/*bim viewer即用于显示模型文件的组件*/
@Component({
  selector: 'app-bim-viewer',
  templateUrl: './bim-viewer.component.html',
  styleUrls: ['./bim-viewer.component.css', './bim-viewer-2.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BimViewerComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('viewerDiv') viewerDiv;
  // 模块选择事件
  @Output() onSelectionChange = new EventEmitter<any>();
  // 加载完成事件
  @Output() onBimModelLoad = new EventEmitter<BiaViewerModels>();
  @Input() height = '400px';
  @Input() project: ProjectDto;
  // 所有bim模型的列表，当前选择模型
  bimModelFiles: BimModelDto[];
  // 切换模型事件
  @Output() selectedBimModelChange = new EventEmitter<BimModelDto>();
  // 当前显示的模型
  selectedBimModel: BimModelDto;
  // 被分组后的dbId，用于颜色，构件生产
  statedBimModelDbIds: GetBimModelDbIdsOutput;
  // bim 配置
  private viewerConfig = {extensions: ['Autodesk.Viewing.ZoomWindow'], disabledExtensions: {measure: false, section: false}};
  // forgerViewer的实例定义
  private viewer: any;

  constructor(
    private _projectService: ProjectServiceProxy,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('project' in changes) {
      // 获取模型列表
      this.list();
    }
  }
  ngOnInit() {
    // 取得viewer的Html，设置/初始化viewer
    this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.viewerDiv.nativeElement, this.viewerConfig);
    // 初始化viewer的部分UI组件
    Autodesk.Viewing.Initializer({env: 'Local', offline: true});
    // 初始化模型加载完毕事件
    this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
      const instanceTree = this.viewer.model.getData().instanceTree;
      const models = this.getCategory(instanceTree, instanceTree.getRootId(), new BiaViewerModels());
      this.onBimModelLoad.emit(models);
    });
    // 初始化选择事件
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, () => {
      const currSelection = this.viewer.getSelection();
      console.log(currSelection)
      this.onSelectionChange.emit(currSelection);
    });
  }
  // 获取bim模型列表上传成功后也会调用这个方法
  list(id: string = undefined) {
      this._projectService.getAllBimModels(this.project.id).subscribe(result => {
        this.bimModelFiles = result.items;
        if (result.items && this.bimModelFiles.length > 0) {
          if (id) {
            this.selectedBimModel = result.items.find(v => v.id === id);
          } else {
            this.selectedBimModel = this.bimModelFiles[0];
          }
          this.initBimViewer(this.bimModelFiles[0]);
          // this.bimModelFiles.forEach(v => {
          //   this.viewer.loadModel(v.bimModelUrl);
          // });
        } else if (this.viewer.impl.selector) {
          this.viewer.tearDown();
        }
      });
  }
  // 初始化bim模型
  initBimViewer(bm: BimModelDto) {
    // 选择模型
    this.selectedBimModelChange.emit(bm);
    this.selectedBimModel = bm;
    // 如果有模型则释放加载新模型，否则就初始化
    if (this.viewer.impl.selector) {
      // 释放模型
      this.viewer.tearDown();
      // 设置配置
      this.viewer.setUp(this.viewerConfig);
      // 加载模型
      this.viewer.loadModel(AppConsts.remoteServiceBaseUrl + bm.bimModelUrl, this.viewerConfig);
    } else {
      // 模型显示启动
      this.viewer.start(AppConsts.remoteServiceBaseUrl + bm.bimModelUrl, this.viewerConfig);
    }
    this.getStatedBimModelDbIds(bm);
// this.addNewButton();   // for testing purpose  by Peng on 2019-2-26
  }
  // 加载构件不同状态的构件，回调函数用于展示隐藏新旧构件
  getStatedBimModelDbIds(bm: BimModelDto, callback: () => void = null) {
    this._projectService.getBimModelDbIds(bm.id).subscribe(result => {
      this.statedBimModelDbIds = result;
      console.log(result)
      if (callback) {
        callback();
      }
    });
  }
  // 选择构件方法
  select(selectedDbIds: number[]) {
    this.viewer.select(selectedDbIds, Autodesk.Viewing.SelectionMode.OVERLAYED);
    console.log(selectedDbIds)
    this.viewer.fitToView(selectedDbIds);
    // this.viewer.explode(1);
  }
  // 隐藏其他构件，显示需要构件方法
  showByDbIds(dbId: number[] = null) {
    this.viewer.getObjectTree(result => {
      if (dbId) {
        this.viewer.hide(Object.keys(result.nodeAccess.dbIdToIndex).map(v => +v));
        this.viewer.show(dbId);
      } else {
        this.viewer.showAll();
      }
    });
  }
  ngOnDestroy(): void {
    // 销毁viewer释放内存
    if (this.viewer) {
      this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT);
      this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT);
      if (this.viewer.impl.selector) {
        this.viewer.tearDown();
        this.viewer.finish();
        this.viewer = null;
      }
    }
  }
  // 弃用 for testing purpose  by Peng on 2019-2-26
  addNewButton() {
    let btnNew = new Autodesk.Viewing.UI.Button('btnNew'); //新增一个按钮
    btnNew.onClick = function (e) {
      //给按钮添加点击事件
    }
    btnNew.setToolTip('新的按钮'); //鼠标放置按钮上方时的显示
    btnNew.container.children[0].innerHTML = 'Test'; //按钮上显示的内容

    // 获取按钮工具栏ToolBar
    var mainToolbar = this.viewer.getToolbar(true);

    // 新建一个按钮组对象，自定义id为new_viewer_control_group
    var _mainViewerSubToolbar = new Autodesk.Viewing.UI.ControlGroup('new_viewer_control_group');
    // 将新按钮添加到新按钮组中
    _mainViewerSubToolbar.addControl(btnNew);
    // 将新按钮组添加到按钮工具栏中
    mainToolbar.addControl(_mainViewerSubToolbar);
  }

  // 弃用 设置颜色
  setColors(bimModel: BimModelDto) {
    const _this = this;
    const setMaterialOfDbIds = (dbIds) => {
      var colorM = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        specular: 0xff0000
      });
      _this.viewer.impl.matman().addMaterial("common color material", colorM, true);
      for (let dbId of dbIds) {
        _this.viewer.model.getData().instanceTree.enumNodeFragments(dbId, function (fragId) {
          _this.viewer.model.getFragmentList().setMaterial(fragId, colorM);
          var fragProxy = _this.viewer.impl.getFragmentProxy(_this.viewer.model, fragId)
          fragProxy.updateAnimTransform()
        });
      }
      _this.viewer.impl.invalidate(true);
    };
    // this.viewer.setSelectionColor(new THREE.Color(200));
    // setMaterialOfDbIds([18]);
    this.viewer.clearThemingColors()
    this.viewer.setThemingColor(18, new THREE.Vector4( 255 / 255, 0, 0, 1 ));
    this._projectService.getBimModelDbIds(bimModel.id).subscribe(result => {
      this.statedBimModelDbIds = result;
      // this.viewer.setThemingColor(result.finishedDbIds, new THREE.Vector4(76 / 255, 175 / 255, 80 / 255, 1));
      // this.viewer.setThemingColor(result.noStateDbIds, new THREE.Vector4(233 / 255, 30 / 255, 99 / 255, 1));
      // this.viewer.setThemingColor(result.processingDbIds, new THREE.Vector4(255 / 255, 152 / 255, 0, 1));
      // this.viewer.setThemingColor(result.offStateDbIds, new THREE.Vector4(159 / 255, 159 / 255, 159 / 255, 1));
    });
  }
  // 获取不同种类构件的dbIds
  private getCategory(instanceTree, parent, models) {
    // 获取父的节点的名字
    models[instanceTree.getNodeName(parent)] = [];
    // 遍历parent变量的子节点的方法
    instanceTree.enumNodeChildren(parent, childId => {
      // 获取父节点子的计数，和孩子的子的计数，如果都>0说明childId还没有遍历到最后一级
      if (instanceTree.getChildCount(parent) > 0 && instanceTree.getChildCount(childId) > 0) {
        this.getCategory(instanceTree, childId, models);
      } else {
        // 如果正在倒数第二个节点里面遍历并返回
        models[instanceTree.getNodeName(parent)].push(childId);
        // instanceTree.enumNodeChildren(parent, subChildId => models[instanceTree.getNodeName(parent)].push(subChildId));
      }
    });
    return models;
  }
// 获取模型里面的属性图
// getObjectTree和instanceTree.getRootId()可能是同一个方法
// this.viewer.getObjectTree(tree => console.log(tree));
// const allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);

// 获取名字里面方括号的id
// if (currSelection.length > 0) {
//   event.model.getProperties(currSelection[0], (property) => {
//     // property可以得到属性和code，currSelection是组件的bimId
//     const matcher = property.name.match(/\[([^\]]+)]/);
//     if (matcher != null && matcher.length > 0) {
//       this.onSelectionChange.emit(matcher[1]);
//     } else {
//       alert('bim模型命名不规则，请使用“名字[编号]”的命名，例如：屋顶[12345] 楼梯[T4321]');
//     }
//   });
// }
}
