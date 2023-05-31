#!/bin/bash
echo "---------------current directory - /home/ec2-user----------------"
# get current directory 
pwd
# get current directory files
ls -al
echo "---------------unzipping webapp----------------"
sudo mkdir webapp
# cd webapp && unzip ./webapp.zip
sudo unzip ./webapp.zip -d ./webapp
sudo chmod 755 webapp
rm -rf ./webapp.zip
ls
sudo chown -R ec2-user ./webapp
cd ./webapp

# cd webapp

ls -a
pwd
touch .env

echo "---------------initialising app----------------"
sudo npm i
sudo npm i bcrypt
sleep 10

# sudo npm install node-gyp -g
# sudo npm install bcrypt -g

# sudo npm install bcrypt --save
# npm ls bcrypt
# echo "bcrypt done"
# sudo npm install

# echo "npm install done"
# mysql -u ec2-user -pPassword123@ -e "SHOW DATABASES;"
# ls

# node server.js
# pm2 start server.js


echo "---------------Setting up systemd----------------"
# touch /home/ec2-user/webapp/.env
sudo cp /home/ec2-user/webapp/service/node.service /etc/systemd/system/node.service
sudo cp /home/ec2-user/webapp/cloudwatch-config.json /opt/cloudwatch-config.json
sudo systemctl daemon-reload

sudo systemctl enable node.service

sudo systemctl start node.service
journalctl -u node.service -b



# echo "---------------setting up webapp directory and permissions - Webapp----------------"
# # create director in home/ec2-user
# sudo mkdir webapp
# # unzip the file in webapp directory
# sudo unzip ./webapp.zip -d ./webapp
# # change the permissions to 755 of directory webapp
# sudo chmod 755 webapp
# # remove zip folder
# # rm -rf ./webapp.zip
# ls
# # change permission of webapp
# # sudo chown -R ec2-user ./webapp

# cp server.js ./webapp
# echo "---------------setting up webapp directory and permissions - Webapp----------------"
# cd ./webapp
# echo "npm init"
# npm init

# echo "npm install"
# npm install

# echo "at node server.js"
# node server.js
