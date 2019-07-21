#!/usr/bin/env bash
cd /home
# echo "====备份数据库===="
rm -rf dotnet-html dotnet  # 清除老文件
mkdir dotnet-html
mkdir dotnet
echo "====清理文件成功===="
cd publish
7za x dist.7z -o../dotnet-html # 解压
7za x dotnet.7z -o../dotnet
find ../dotnet-html/assets -type d -exec chmod 755 {} \; # 修改权限
echo "====解压编译后文件完成===="
perl -pi -e 's/utf8mb4_0900_ai_ci/utf8mb4_unicode_ci/g' dotnet.sql # 批量替换字符集
mysql -u root -p1793 -e "drop database manufacturesysdb;create database manufacturesysdb;use manufacturesysdb;source /home/publish/dotnet.sql;" # 执行mysql脚本
echo "====数据库添加成功===="
cd ../
rm -rf publish # 删除发布的文件
cd dotnet
~/.dotnet/dotnet ManufactureSys.Web.Host.dll --urls=http://localhost:21021   #启动后端API服务器