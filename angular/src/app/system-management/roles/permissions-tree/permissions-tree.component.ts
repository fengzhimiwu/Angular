import {Component, EventEmitter, Injectable, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FlatTreeControl} from '@node_modules/@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@node_modules/@angular/material';
import {SelectionModel} from '@node_modules/@angular/cdk/collections';
import {BehaviorSubject} from '@node_modules/rxjs';
import {FlatPermissionDto} from '@shared/service-proxies/service-proxies';
import {AsyncStateChangerService} from '@shared/service-proxies/async-state-changer.service';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  name: string;
  description: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  name: string;
  description: string;
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-permissions-tree',
  templateUrl: './permissions-tree.component.html',
  styleUrls: ['./permissions-tree.component.css'],
})
export class PermissionsTreeComponent implements OnInit, OnChanges {
  @Input() disabled = false;
  @Input() permissions: FlatPermissionDto[];
  @Input() grantedPermissions: string[];
  @Output() grantedPermissionsChange = new EventEmitter<string[]>();
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(
    private _stateChanger: AsyncStateChangerService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    // 添加或删除权限
    // this.checklistSelection.changed.subscribe((result) => console.log(result));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permissions'].isFirstChange()) {
      // 建立树形结构
      this.dataSource.data = this.buildHierarchy(this.permissions, null, 0);
    }
    if (changes['grantedPermissions'].isFirstChange()) {
      // 监听勾选
      this.checklistSelection.changed.subscribe((result) => {
        if (result.added.length > 0) { // 添加监听
          result.added.forEach(v => {
            // -1说明不在里面，加入
            if (this.grantedPermissions.indexOf(v.name) === -1) {
              this.grantedPermissions.push(v.name);
            }
          });
        }
        if (result.removed.length > 0) { // 移除监听
          result.removed.forEach(v => {
            const i = this.grantedPermissions.indexOf(v.name);
            // 不是-1说明在里面，删除
            if (i !== -1) {
              this.grantedPermissions.splice(i, 1);
            }
          });
        }
        // console.log(this.grantedPermissions);
      });
    }
  }
  // 建立树形图
  buildHierarchy(data: FlatPermissionDto[], parent, level: number) {
    const children = [];
    data.forEach(v => {
      const p = v.name.split('.');
      if ((level === 0 && p.length === level + 1) || (p[level - 1] === parent && p.length === level + 1)) {
        const item = new TodoItemNode();
        item.name = v.name;
        item.item = v.displayName;
        item.description = v.description;
        item.children = this.buildHierarchy(data.filter(f => f.name.indexOf(v.name) !== -1), p[level], level + 1);
        children.push(item);
      }
    });
    if (children.length === 0) {
      return null;
    }
    return children;
  }

  ngOnInit(): void {
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';
  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.name = node.name;
    flatNode.description = node.description;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    // 选择被允许的权限
    if (this.grantedPermissions.indexOf(node.name) !== -1) {
      this.checklistSelection.select(flatNode);
    }
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    if (!this.descendantsPartiallySelected(node)) {
      this.checklistSelection.toggle(node);
    }
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    // this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    // descendants.every
    const descAllSelected = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
