#!/bin/bash
echo "---------------update software----------------"
sudo yum update -y
sudo yum upgrade -y

echo "---------------Installing node----------------"

curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs
node -v
npm -v




