# 拯救学习委员之作业管理系统—前端部分

# 后端部分：<a href="https://github.com/DangerFickle/Task-Manage-Back">拯救学习委员之作业管理系统—后端部分</a>

## 项目背景
学习委员收集作业的过程，繁琐且曲折，作者充分理解并体谅为大家服务的苦逼学习委员，以此为出发点和灵感，设计并开发了此套作业管理系统，希望能帮助各位提高效率，早日摆脱重复机械式的工作，欢迎二开，如有更多的创意和建议，欢迎留言！

## 环境

**基于Vue脚手架**

* vue-admin-template
  * Github地址：https://github.com/PanJiaChen/vue-admin-template

* EementUI

## 部署

****

1. 下载源码，导入到任意IDE，这里使用WebStorm进行演示

   * 项目地址：https://github.com/DangerFickle/Task-Manage-Front

2. 修改配置，将后端接口地址修改为自己的

   ![](https://img.belongme.top/images/202304032308741.png)

3. 在命令行执行

   ~~~java
   npm run build:prod
   ~~~

   * 构建完成后，会在根目录下生成dist文件夹

     ![](https://img.belongme.top/images/202304032312698.png)

     

   * 将dist文件夹中的文件部署为静态网站即可

     ![](https://img.belongme.top/images/202304032312679.png)



## 功能展示

### 1、登陆页

* 默认管理员账号：admin
* 默认管理员密码：123456

![](https://img.belongme.top/images/202304032229769.png)



### 2、首页

![](https://img.belongme.top/images/202304032231025.png)



### 3、提交作业

![](https://img.belongme.top/images/202305022203923.png)



### 4、课程管理

![](https://img.belongme.top/images/202304032232904.png)



### 5、批次管理

* 需选择一门课程才会显示该课程下的所有批次，如果没有请先创建课程

![](https://img.belongme.top/images/202304032232214.png)



### 6、提交详情

* 需选择一门课程才会显示该课程下的所有批次，如果没有请先创建课程

  ![](https://img.belongme.top/images/202304032234583.png)

* 该页面功能：

  * 下载全部文件（必须在该批次已截止的情况下），点击下载全部会打包好所有文件到zip文件，并自动下载

    ![](https://img.belongme.top/images/202304032238292.png)

  * 查看已交人员

    每个已交人员项后都有一个【下载】按钮，可以下载该用户提交的作业（必须在该批次已截止的情况下）

    ![](https://img.belongme.top/images/202304032241264.png)

  * 查看未交人员

    每个未交人员项后都有一个【提醒TA】按钮，可以向该用户绑定的邮箱发送一封作业提交提醒邮件，未绑定邮箱则不发送

    ![](https://img.belongme.top/images/202304032244981.png)



### 7、人员管理

![](https://img.belongme.top/images/202304032249648.png)

* 添加人员

  * 密码为非必填项，不填默认与学号相同

    ![](https://img.belongme.top/images/202304032250038.png)

  * 可选角色有三种：

    * 系统管理员：具有系统中所有操作的权限，以下为系统管理员看到的页面

      ![](https://img.belongme.top/images/202304032231025.png)

      

    * 普通管理员：相比系统管理员，只少了人员管理，以下为普通管理员看到的页面

      ![](https://img.belongme.top/images/202304032302752.png)

      

    * 普通用户：只能操作自己提交的作业，和个人中心，以下为普通用户看到的页面

      ![](https://img.belongme.top/images/202304032302484.png)

  

### 8、个人中心

* 修改密码和绑定邮箱在这里完成

![](https://img.belongme.top/images/202304032318511.png)
