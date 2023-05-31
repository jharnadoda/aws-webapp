variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-0dfcb1ef8550277af" # Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type
}

variable "ssh_username" { #change
  type    = string
  default = "ec2-user"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "subnet_id" { #change
  type    = string
  default = "subnet-0be70c2a778752b8d"
}

variable "ami_regions" {
  type    = list(string)
  default = ["us-east-1"]
}

variable "ami_users"{
  type= list(string)
  default =["391864453288"]
}

variable "AWS_SECRET_ACCESS_KEY" {
  type    = string
  default = "${env("AWS_SECRET_ACCESS_KEY")}"
}

variable "AWS_ACCESS_KEY_ID" {
  type    = string
  default = "${env("AWS_ACCESS_KEY_ID")}"
}
# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  profile = "dev"
  // access_key      = "${var.AWS_ACCESS_KEY_ID}"
  // secret_key      = "${var.AWS_SECRET_ACCESS_KEY}"
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_regions     = "${var.ami_regions}"
  instance_type   = "${var.instance_type}"
  source_ami      = "${var.source_ami}"
  ssh_username    = "${var.ssh_username}"
  subnet_id       = "${var.subnet_id}"
  ami_users       = "${var.ami_users}"


  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "~/"
  }

  provisioner "file" {
    source      = "bootstrap_init.sh"
    destination = "~/"
  }

  provisioner "file" {
    source      = "file_init.sh"
    destination = "~/"
  }

   provisioner "file" {
    source = "cloudwatch_init.sh"
    destination = "~/"
  }

  provisioner "file" {
    source = "cloudwatch-config.json"
    destination = "~/"
  }
  // provisioner "file" {
  //   source = "env_init.sh"
  //   destination = "~/"
  // }

  // provisioner "file" {
  //   source = "app_init.sh"
  //   destination = "~/"
  // }

  provisioner "file" {
    source      = "db_init.sh"
    destination = "~/"
  }

  provisioner "file" {
    source      = "./service/node.service"
    destination = "~/"
  }
  provisioner "shell" {
    inline = [
      "pwd",
      "ls -a -l",
      "sudo bash ~/bootstrap_init.sh",
      "sudo bash ~/cloudwatch_init.sh",
      "sudo bash ~/file_init.sh"
      
    ]
  }
  post-processor "manifest" {
    output = "manifest.json"
    strip_path = true
  }
}
