// 文件类型判断工具
export class FileTypeHelper {
  static readonly imgTypes = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.svg', '.webp'];
  // 判断是否为图片
  static isImg(ext: string): boolean {
    const a = ext.split('/');
    if (a.length > 1 && a[0] === 'image') {
      return true;
    }
    return this.imgTypes.indexOf(ext) > -1;
  }
}
