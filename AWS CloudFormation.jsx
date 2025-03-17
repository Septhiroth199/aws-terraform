{
    "AWSTemplateFormatVersion": "2010-09-09",
    "Description": "Create an Amazon EC2 t2.micro instance running Amazon Linux 2 with SSH access.",
    "Parameters": {
        "KeyName": {
            "Description": "Name of an existing EC2 KeyPair to enable SSH access to the instance",
            "Type": "AWS::EC2::KeyPair::KeyName",
            "ConstraintDescription": "must be the name of an existing EC2 KeyPair."
        },
        "SSHLocation": {
            "Description": "The IP address range that can be used to SSH to the EC2 instance",
            "Type": "String",
            "Default": "3.72.29.104/32",
            "MinLength": 9,
            "MaxLength": 18,
            "AllowedPattern": "(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})/(\\d{1,2})",
            "ConstraintDescription": "must be a valid IP CIDR range of the form x.x.x.x/x."
        },
        "SubnetId": {
            "Description": "The Subnet ID where the instance will be created",
            "Type": "AWS::EC2::Subnet::Id"
        }
    },
    "Resources": {
        "EC2Instance": {
            "Type": "AWS::EC2::Instance",
            "Properties": {
                "InstanceType": "t2.micro",
                "SubnetId": {
                    "Ref": "SubnetId"
                },
                "SecurityGroupIds": [
                    {
                        "Ref": "InstanceSecurityGroup"
                    }
                ],
                "KeyName": {
                    "Ref": "KeyName"
                },
                "ImageId": {
                    "Fn::FindInMap": [
                        "RegionAMI",
                        {
                            "Ref": "AWS::Region"
                        },
                        "AMI"
                    ]
                }
            }
        },
        "InstanceSecurityGroup": {
            "Type": "AWS::EC2::SecurityGroup",
            "Properties": {
                "GroupDescription": "Enable SSH access via port 22",
                "SecurityGroupIngress": [
                    {
                        "IpProtocol": "tcp",
                        "FromPort": 22,
                        "ToPort": 22,
                        "CidrIp": {
                            "Ref": "SSHLocation"
                        }
                    }
                ]
            }
        }
    },
    "Mappings": {
        "RegionAMI": {
            "us-east-1": { "AMI": "ami-0c55b159cbfafe1f0" },  // Amazon Linux 2 in us-east-1
            "us-west-2": { "AMI": "ami-0c55b159cbfafe1f0" },  // Amazon Linux 2 in us-west-2
            "us-west-1": { "AMI": "ami-0c55b159cbfafe1f0" },  // Amazon Linux 2 in us-west-1
            "eu-west-1": { "AMI": "ami-0c55b159cbfafe1f0" },  // Amazon Linux 2 in eu-west-1
            "ap-south-1": { "AMI": "ami-0c55b159cbfafe1f0" }   // Amazon Linux 2 in ap-south-1
        }
    },
    "Outputs": {
        "InstanceId": {
            "Description": "InstanceId of the newly created EC2 instance",
            "Value": {
                "Ref": "EC2Instance"
            }
        },
        "PublicIP": {
            "Description": "Public IP address of the newly created EC2 instance",
            "Value": {
                "Fn::GetAtt": [
                    "EC2Instance",
                    "PublicIp"
                ]
            }
        }
    }
}