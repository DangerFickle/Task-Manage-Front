import { request } from "@/utils/service"
import { ApiResponse } from "../../../types/api";
import { Role } from "@/api/role/type/role";

export default {
  getRoleList() {
    return request<ApiResponse<Array<Role>>>({
      url: `/role/list`,
      method: "get"
    })
  }
}
