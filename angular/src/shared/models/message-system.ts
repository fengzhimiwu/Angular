// 用于发送消息的实体
export class MessageLogInput {
  public creatorUserId: number;
  public receiverUserId: number;
  public content: string;
  public fileItemId: string;
}
