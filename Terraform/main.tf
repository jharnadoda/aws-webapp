provider "aws" {
  region  = var.region
  profile = var.profile

}
resource "aws_vpc" "vpc" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    "Name" = "vpc"
  }

}

resource "aws_subnet" "public_subnet" {
  count                   = length(var.public_subnet_cidr_block)
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.public_subnet_cidr_block[count.index]
  availability_zone       = var.availability_zone[count.index]
  map_public_ip_on_launch = true
  tags = {
    "Name" = "public_subnet_${count.index + 1}"
  }


}


resource "aws_subnet" "private_subnet" {
  count                   = length(var.private_subnet_cidr_block)
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.private_subnet_cidr_block[count.index]
  availability_zone       = var.availability_zone[count.index]
  map_public_ip_on_launch = false
  tags = {
    "Name" = "private_subnet_${count.index + 1}"
  }


}
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    "Name" = "igw"
  }

}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    "Name" = "public_route_table"
  }

}

resource "aws_route_table_association" "public_route_table_association" {
  count          = length(var.availability_zone)
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_route_table.id

}


resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    "Name" = "private_route_table"
  }

}

resource "aws_route_table_association" "private_route_table_association" {
  count          = length(var.availability_zone)
  subnet_id      = aws_subnet.private_subnet[count.index].id
  route_table_id = aws_route_table.private_route_table.id

}

resource "aws_route" "public_route" {
  route_table_id         = aws_route_table.public_route_table.id
  destination_cidr_block = var.destination_cidr_block
  gateway_id             = aws_internet_gateway.igw.id

}

resource "aws_security_group" "application_security_group" {
  name_prefix = "application_security_group"
  vpc_id      = aws_vpc.vpc.id



  ingress {
    from_port       = 22 #can we hardcode this?
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.load_balancer_sg.id]
    cidr_blocks     = [var.cidr_block_security]

  }

  # ingress {
  #   from_port       = 80
  #   to_port         = 80
  #   protocol        = "tcp"
  #   security_groups = [aws_security_group.load_balancer_sg.id]
  #   cidr_blocks     = [var.cidr_block_security]
  # }

  # ingress {
  #   from_port       = 443
  #   to_port         = 443
  #   protocol        = "tcp"
  #   security_groups = [aws_security_group.load_balancer_sg.id]
  #   cidr_blocks     = [var.cidr_block_security]
  # }

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.load_balancer_sg.id]
    cidr_blocks     = [var.cidr_block_security]

    # source_security_group_id = aws_security_group.load_balancer_sg
    # security_groups = [ aws_security_group.load_balancer_sg.id ]
    # security_groups = [aws_security_group.database_security_group.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.cidr_block_security]
    # security_groups = [aws_security_group.database_security_group.id]
  }
  # egress {
  #   from_port   = 0
  #   to_port     = 0
  #   protocol    = "all"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  # ingress {
  #   from_port   = 0
  #   to_port     = 65535
  #   protocol    = "tcp"
  #   cidr_blocks = [var.cidr_block_security]
  # }
  # egress {
  #   from_port = 0
  #   to_port = 65535
  #   protocol = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }
}




#Create an EC2 instance

# resource "aws_instance" "ec2_instance" {
#   ami                    = var.ami_id
#   instance_type          = "t2.micro"
#   vpc_security_group_ids = [aws_security_group.application_security_group.id]
#   subnet_id              = aws_subnet.public_subnet[1].id
#   root_block_device {
#     volume_size           = 50
#     volume_type           = "gp2"
#     delete_on_termination = true
#   }

#   tags = {
#     "Name" = "webapp-server"
#   }
#   disable_api_termination     = false
#   associate_public_ip_address = true
#   # add endpoint!!!!
#   user_data = <<-EOF
# #!/bin/bash
# cd /home/ec2-user/webapp
# touch ./.env

# echo "DB_HOST=$(echo ${aws_db_instance.database.endpoint} | cut -d ':' -f 1)" >> .env
# echo "DB_USER=${aws_db_instance.database.username}" >> .env
# echo "DB_PASSWORD=${aws_db_instance.database.password}" >> .env
# echo "S3_BUCKET_NAME=${aws_s3_bucket.private_bucket.bucket}" >> .env
# sleep 10



# sudo su
# cd /
# mkdir ./upload
# sudo chown ec2-user:ec2-user /home/ec2-user/*

# sudo chmod -R 777 /home/ec2-user/*

# sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
#     -a fetch-config \
#     -m ec2 \
#     -c file:/opt/cloudwatch-config.json \
#     -s


# cd /home/ec2-user/webapp
# sudo systemctl stop node.service
# node server.js

# source ./.env


# EOF

#   iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
#   availability_zone    = var.availability_zone[1]
# }



#a5
#Create a security group

resource "aws_security_group" "database_security_group" {
  name_prefix = "database_"
  vpc_id      = aws_vpc.vpc.id


  # Allow incoming TCP traffic on port 3306 for MySQL
  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.application_security_group.id]
  }
  # security_groups = [aws_security_group.application_security_group.id]

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # Restrict SSH access to VPC CIDR range
  }

  # egress {
  #   from_port   = 0
  #   to_port     = 0
  #   protocol    = "all"
  #   cidr_blocks = ["0.0.0.0/0"] # Restrict SSH access to VPC CIDR range
  #   // security_groups = [aws_security_group.instance.id]
  # }
  egress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.application_security_group.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # egress {
  #   from_port = 0
  #   to_port = 65535
  #   protocol = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }


  # ingress {
  #   from_port   = 0
  #   to_port     = 0
  #   protocol    = "-1"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

}

#Generate uuid
locals {
  bucket_name = "mybucket-${uuid()}"
}

resource "aws_s3_bucket" "private_bucket" {
  bucket = local.bucket_name
  # acl    = "private"

  # Ensure Terraform can delete the bucket even if it is not empty
  force_destroy = true

}
# Create lifecycle policy to transition objects from STANDARD to STANDARD_IA after 30 days
resource "aws_s3_bucket_lifecycle_configuration" "lifecycle_policy_s3" {
  bucket = aws_s3_bucket.private_bucket.id
  rule {
    id     = "standard-to-standard-ia"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    filter {
      prefix = ""
    }

  }
}

resource "aws_db_parameter_group" "database" {
  name_prefix = "database-"
  family      = "mysql8.0"

  parameter {
    name  = "max_connections"
    value = 100
  }

  parameter { #check if needed
    name  = "innodb_buffer_pool_size"
    value = "67108864"
  }

}

resource "aws_kms_key" "rds_kms_key" {
  deletion_window_in_days = 10
  
}
# Create RDS instance
resource "aws_db_instance" "database" {
  identifier             = "csye6225"
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "mysql"  # or "postgres"
  engine_version         = "8.0.26" # or "13"
  instance_class         = "db.t3.micro"
  db_name                = var.db_name
  username               = var.username
  password               = var.password
  parameter_group_name   = aws_db_parameter_group.database.name
  vpc_security_group_ids = [aws_security_group.database_security_group.id]
  db_subnet_group_name   = aws_db_subnet_group.private-subnet.name

  publicly_accessible = false
  skip_final_snapshot = true
  storage_encrypted = true
  kms_key_id = aws_kms_key.rds_kms_key.arn

}
resource "aws_db_subnet_group" "private-subnet" {
  name       = "private-subnet-group-for-rds-instances"
  subnet_ids = [aws_subnet.private_subnet[1].id, aws_subnet.private_subnet[2].id]


}

resource "aws_iam_policy" "webapp_s3_policy" {
  name = "WebAppS3"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${aws_s3_bucket.private_bucket.bucket}",
          "arn:aws:s3:::${aws_s3_bucket.private_bucket.bucket}/*" #change
        ]
      }
    ]
  })


}
resource "aws_iam_role" "ec2_role" {
  name = "EC2-CSYE6225"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })


}
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "EC2-CSYE6225"
  role = aws_iam_role.ec2_role.name
}
resource "aws_iam_policy_attachment" "s3_access_attachment" {
  name       = "s3_policy_attachment"
  policy_arn = aws_iam_policy.webapp_s3_policy.arn
  roles      = [aws_iam_role.ec2_role.name]

}

resource "aws_iam_policy_attachment" "cloudwatch_agent_server_policy_attachment" {
  name       = "cloudwatch_policy_attachment"
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
  roles      = [aws_iam_role.ec2_role.name]
}


output "example_output" {
  value = aws_s3_bucket.private_bucket.bucket

}

data "aws_route53_zone" "route53_zone" {
  name = var.domain_name
}
resource "aws_route53_record" "route53_record" {
  zone_id = data.aws_route53_zone.route53_zone.zone_id
  name    = var.domain_name
  type    = "A"
  depends_on = [
    aws_lb.lb
  ]

  # ttl     = "60"
  alias {
    name                   = aws_lb.lb.dns_name
    zone_id                = aws_lb.lb.zone_id
    evaluate_target_health = true
  }
  # records = ["${aws_instance.ec2_instance.public_ip}"]
}


resource "aws_security_group" "load_balancer_sg" {
  name_prefix = "load_balancer_sg"
  vpc_id      = aws_vpc.vpc.id

  ingress { #HTTP
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { #HTTPS
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
    egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

# resource "aws_launch_configuration" "asg_launch_config" {

#   image_id      = var.ami_id
#   instance_type = "t2.micro"
#   #key_name = var
#   associate_public_ip_address = true
#   iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name
#   security_groups             = aws_security_group.application_security_group


# }

data "template_file" "user_data" {
  template = <<-EOF
#!/bin/bash
echo "test" > /opt/user_data_test.txt
cd /home/ec2-user/webapp
touch ./.env

echo "DB_HOST=$(echo ${aws_db_instance.database.endpoint} | cut -d ':' -f 1)" >> .env
echo "DB_USER=${aws_db_instance.database.username}" >> .env
echo "DB_PASSWORD=${aws_db_instance.database.password}" >> .env
echo "S3_BUCKET_NAME=${aws_s3_bucket.private_bucket.bucket}" >> .env
sleep 10



sudo su
cd /
mkdir ./upload
sudo chown ec2-user:ec2-user /home/ec2-user/*

sudo chmod -R 777 /home/ec2-user/*

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/cloudwatch-config.json \
    -s


cd /home/ec2-user/webapp

sudo systemctl enable amazon-cloudwatch-agent.service
sudo systemctl stop node.service
sudo systemctl daemon-reload
sudo systemctl enable node.service
sudo systemctl start node.service




source ./.env


EOF


}

resource "aws_kms_key" "ebs_kms_key" {
deletion_window_in_days = 10

}

resource "aws_launch_template" "lt" {
  name          = "asg_launch_template"
  image_id      = var.ami_id
  instance_type = "t2.micro"

  # security_group_names = [aws_security_group.application_security_group.name]
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }
  # disable_api_termination = false
  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.application_security_group.id]
  }

  block_device_mappings {
    device_name = "/dev/sdm"

    ebs {
      volume_size           = 50
      volume_type           = "gp2"
      delete_on_termination = true
      encrypted = true
      kms_key_id = aws_kms_key.ebs_kms_key.custom_key_store_id

    }
  }

  # subnet_id              = aws_subnet.public_subnet[1].id
  # availability_zone    = var.availability_zone[1]
  user_data = base64encode(data.template_file.user_data.rendered)
}

resource "aws_autoscaling_group" "asg" {
  name                      = "csye6225-asg-spring2023"
  default_cooldown          = 60
  desired_capacity          = 1
  min_size                  = 1
  max_size                  = 3
  health_check_type         = "EC2"
  health_check_grace_period = 90

  # availability_zones        = [var.availability_zone[0], var.availability_zone[1], var.availability_zone[2]]
  vpc_zone_identifier = [aws_subnet.public_subnet[1].id]
  tag {
    key                 = "Application"
    value               = "WebApp"
    propagate_at_launch = true
  }
  tag {
    key                 = "Name"
    value               = "Csye6225-ec2"
    propagate_at_launch = true
  }

  launch_template {
    id      = aws_launch_template.lt.id
    version = "$Latest"
  }

  target_group_arns = [aws_lb_target_group.alb_tg.arn]


}

resource "aws_autoscaling_policy" "scale_up" {
  name                   = "scale-up-policy"
  policy_type            = "TargetTrackingScaling"
  autoscaling_group_name = aws_autoscaling_group.asg.name

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }

    target_value = 5.0
  }
}

resource "aws_autoscaling_policy" "scale_down" {
  name                   = "scale-down-policy"
  policy_type            = "TargetTrackingScaling"
  autoscaling_group_name = aws_autoscaling_group.asg.name

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }

    target_value = 3.0
  }
}

resource "aws_lb" "lb" {
  name            = "csye6225-lb"
  ip_address_type = "ipv4"
  idle_timeout    = "60"

  internal           = false
  load_balancer_type = "application"
  security_groups = [
    aws_security_group.load_balancer_sg.id,
  ]


  subnets = [
    aws_subnet.public_subnet[0].id,
    aws_subnet.public_subnet[1].id,
    aws_subnet.public_subnet[2].id
  ]

  tags = {
    Application = "Webapp"
    Name        = "csye6225-lb"
  }
}

resource "aws_lb_target_group" "alb_tg" {
  name                 = "csye6225-lb-alb-tg"
  target_type          = "instance"
  port                 = 3000
  protocol             = "HTTP"
  ip_address_type      = "ipv4"
  vpc_id               = aws_vpc.vpc.id
  deregistration_delay = 20



  health_check {
    enabled             = true
    path                = "/healthz"
    port                = "3000"
    interval            = 30
    timeout             = 29
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 2


  }
}

resource "aws_lb_listener" "lb_listener_http" {
  load_balancer_arn = aws_lb.lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.alb_tg.arn
    type             = "forward"
  }
  #  certificate_arn = var.certificate-arn
}

resource "aws_lb_listener" "lb_listener" {
  load_balancer_arn = aws_lb.lb.arn
  port              = 443
  protocol          = "HTTPS"

  default_action {
    target_group_arn = aws_lb_target_group.alb_tg.arn
    type             = "forward"
  }
   certificate_arn = var.certificate-arn
}

# resource "aws_lb_listener_certificate" "dev-certificate" {
#    listener_arn = aws_lb_listener.lb_listener.arn
#   certificate_arn = "arn:aws:acm:us-east-1:543071304884:certificate/12ed57c9-18df-4b36-a6c5-4a59c11a7dfd"
  
# }

# resource "aws_lb_listener_certificate" "certificate" {
#   listener_arn = aws_lb_listener.lb_listener.arn
#   certificate_arn = var.certificate-arn 
  
# }
