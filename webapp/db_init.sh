#!/bin/bash
echo "---------------Installing mysql----------------"
sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm -y

sudo yum install mysql-community-server -y
sudo systemctl start mysqld.service

 systemctl status mysqld

sudo yum update -y


echo "---------------Setting up user and database----------------"
export temp=$(sudo cat /var/log/mysqld.log | grep "A temporary password" | awk -F ' ' '{print $NF}')
mysql -u root -p$temp --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Password123@';
CREATE USER 'ec2-user'@'localhost' IDENTIFIED BY 'Password123@';
GRANT ALL PRIVILEGES ON *.* TO 'ec2-user'@'localhost';FLUSH PRIVILEGES;"
mysql -u ec2-user -pPassword123@ -e "CREATE DATABASE users_database;"


# sudo mysql -u root 
# ALTER USER 'root'@'localhost' IDENTIFIED BY 'Password123@';

# CREATE DATABASE users_database;
# CREATE USER 'jharna'@'localhost' IDENTIFIED BY 'Password123@';
# GRANT ALL PRIVILEGES ON users_database.* TO 'jharna'@'localhost';
# FLUSH PRIVILEGES;
