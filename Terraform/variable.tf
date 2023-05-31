variable "profile" {
  type = string
  # default = "dev"
}

variable "cidr_block" {
  type = string
  #   default = "10.0.0.0/16"

}
variable "vpc_name" {
  type    = string
  default = "csye6225"
}

variable "region" {
  type = string
  #   default = "us-east-1"

}

variable "availability_zone" {
  type = list(any)
  #   default = ["us-east-1a", "us-east-1b", "us-east-1c"]
}


variable "public_subnet_cidr_block" {
  type = list(any)
  #   default = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidr_block" {
  type = list(any)
  #   default = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

variable "destination_cidr_block" {
  type = string

}

variable "cidr_block_security" {
  type = string

}

variable "ami_id" {
  type = string

}

variable "db_name" {
  type = string
}

variable "username" {
  type = string
}

variable "password" {
  type = string
}

variable "domain_name" {
  type = string

}
variable "certificate-arn" {
  type = string
  
}