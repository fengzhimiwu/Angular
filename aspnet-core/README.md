# ManufactrueSys目录

## 如何启动项目（使用pm命令行工具)

1. 打开程序包命令行，选择项目EntityFrameworkCore
2. 首先在pm命令行里面运行add-migration name  
ps: name可以随便起什么名字，不要和以前的Migration重复
3. 然后命令update-database
4. 数据库已经添加好
5. 设置Web.Host为启动项目，点击运行

## 如何启动项目（使用dotnet工具)

1. 打开你的cmd或者powershell，cd目录到EntityFrameworkCore这个项目下面
2. 运行命令dotnet ef migrations add name  
ps: name可以随便起什么名字，不要和以前的Migration重复就行
3. 运行dotnet ef database update  
剩余步骤与另一种方法一致

## 实体代码的风格  

log表一般不做关联，只做记录  
关于构件的记录必须强关联，即Id不能为空  
容易变化的表，它的外键必须可以为空，这样能提供足够的兼容性  
能尽量少使用字段就少使用  
一个表的字段不要太多  

----------

## 代码优先通过ef工具生成数据库

[EntityFramework Tutorial](http://www.entityframeworktutorial.net/efcore/configuration-in-entity-framework-core.aspx)
即EntityFramework教程，关于数据的一些约束可以参考此网站

## ABP的官方文档

[ABP框架官网](https://aspnetboilerplate.com/)
进去后找Documents就可以看到文档了

## 可能出现问题的地方

1. 全局搜索“SubProjectId为空，无法继续操作”  
2. RootAssignmentId
3. 服务器用的mariadb步支持mysql默认的collection。所以生成sql文件后修改默认collection为utf8mb4_unicode_ci
