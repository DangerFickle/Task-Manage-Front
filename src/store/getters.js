const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  studentNumber: state => state.user.studentNumber,
  addRouters: state => state.routes.addRouters
}
export default getters
