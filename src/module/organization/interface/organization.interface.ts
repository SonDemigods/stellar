export interface Organization {
  id: string;
  organizationCode: string;
  name: string;
  parentId: string;
  createTime: Date;
  createUserId: string;
  updateTime: Date;
  updateUserId: string;
  deleteFlag: number;
}
