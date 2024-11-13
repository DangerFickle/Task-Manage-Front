import {User} from "@/api/user/types/user";

export interface GroupMember extends User {
  joinTime?: Date;
}

export interface Group {
  id: string
  name: string
  leader: string
  leaderName: string
  belongCourse: string
  alreadyMember: undefined
  groupMaxMemberSize: undefined
  // members: Array<GroupMember>
  createTime: string
  updateTime: string
}
