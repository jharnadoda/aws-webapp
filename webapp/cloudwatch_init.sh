#!/bin/bash
# sudo yum install -y awslogs
# sudo systemctl start awslogsd
# sudo systemctl enable awslogsd.service

sudo yum install amazon-cloudwatch-agent -y
sudo systemctl start amazon-cloudwatch-agent
sudo systemctl enable amazon-cloudwatch-agent



