#!/usr/bin/env bash
password="1793"       # mysql 数据库root的密码
echo "====开始安装===="
yum install -y epel-release # 安装一些基础内容
yum install -y nginx tmux vim p7zip 
yum install -y libgdiplus-devel libgdiplus
echo "====安装dotnet环境===="
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/7/packages-microsoft-prod.rpm
sudo yum install dotnet-sdk-2.2 -y
echo "====安装mysql数据库===="
curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash # 安装mariadb的源
sudo yum install MariaDB-server galera MariaDB-client MariaDB-shared MariaDB-backup MariaDB-common # 安装mysql的开源版本
echo "====启动mysql数据库===="
systemctl start mariadb      # mysql的开源版本
systemctl enable mariadb

echo "====设置mysql数据库密码为${password}===="  
mysql -u root -e"set password for root@localhost = password('$password');" # mysql root 的密码为 1793 