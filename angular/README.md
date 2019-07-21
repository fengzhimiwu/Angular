# ManufactureSysTemplate

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.31.

## 初次运行前

1. 安装node.js
2. 使用npm install命令安装依赖包

## 如何运行

使用命令行运行npm start  
npm start实际运行了ng serve --host 0.0.0.0 --port 4200 --proxy-config proxy.conf.json  
详情请参考package.json文件

## 相关说明

### 依赖包（已经安装好）

(放弃)angular-gridster2  
@angular/material  
@angular/cdk  

### UI相关

UI用的是基于bootstrap的[bsbAdmin](https://github.com/gurayyarar/AdminBSBMaterialDesign)和[angular material](https://material.angualr.io)
它是material风格的UI，其中也使用了[ngx-bootstrap](http://ngx-bootstrap.com/)(参考modal弹出框)。  
虽然[bootstrap](https://v3.bootcss.com/)的部分样式已经被bsbAdminUI改掉了，但是大部分bootstrap特性还是可以使用的，例如栅格系统。  
其他bootstrap的UI: [bootstrap-select](https://developer.snapappointments.com/bootstrap-select/), ngx-pagination, [font-awesome图标](https://fontawesome.com/)
还有两个动画UI: Animation.css和node-waves(material水波效果)  
material风格的UI组件: [material图标](https://material.io/tools/icons/)  

### 其他组件

ng安装了ng add @angular/pwa
npm安装了npm install @angular/service-worker

### 关于自动生成API

使用了nswag studio，在项目文件夹/nswag里面有api的配置文件，可直接打开生产响应api的调用服务  

### 配置相关

项目的api代理配置在proxy.conf.json
项目的全局地址配置在assets/appconfig.json
全局样式配置在shared/core.less  
全局常量配置在shared/AppConsts.ts  
angular动画在shared/animations，使用的时候记得在组件或者指令里面加入animation属性
类似的全局组件、指令、工具在components, directives, helpers

### nginx相关配置

给nginx的gzpi压缩配置里面添加gz, pf, bin

### forge相关

[forge官方文档](https://forge.autodesk.com/en/docs/viewer/v6/reference/javascript/viewer3d/)  
#### 以上依赖已经安装过了，不用重复安装。

### Angular文档

[Angular中文官网](https://www.angular.cn)

## 可能有的问题
