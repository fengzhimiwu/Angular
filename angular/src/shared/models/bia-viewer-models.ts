// bim中所有被分类好的的模型id，即一个类型多个dbId的形式存储
export class BiaViewerModels {
  [index: string]: number[] | any;

  getAllNames(): string[] {
    const names = [];
    for (const i in this) {
      if (this.hasOwnProperty(i) && this[i].length > 0) {
        names.push(i);
      }
    }
    return names;
  }
}
