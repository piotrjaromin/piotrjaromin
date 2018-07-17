---
layout: post
title:  "How to deploy lambda with git executable"
date:   2018-07-17 18:03:06 +0200
categories: aws lambda git nodejs serverless deploy binary executable
tags: aws lambda git nodejs serverless deploy binary executable
---
# Deploying AWS Lambda with git executable

## Lambda basics

Lambda can be deployed in few ways, one of them is directly writing lambda code in AWS console, which is okay for tests and playing around, but when we want to automate lambda deployment or need to version it, then we should switch to deploying lambda packaged as zip file.

Lambda stored in zip have additional advantage of being able to store not only code but some other file types, like pictures or binary files. In this article we will deploy lambda which can call `git clone` command by using [git](https://git-scm.com/) binary.

NOTE: working code for this article can be found here: https://github.com/piotrjaromin/aws-lambda-git-clone-example

## tl;dr

So here are steps which we will take:

1. Start ec2 micro instance from given image
2. Ssh into machine
3. Install git
4. Copy binary to lambda directory on localhost
5. Prepare lambda code (Remember that should set PATH variable or else you will need to call binary with absolute path)
6. Zip code and binaries together
7. Create role for lambda and deploy zip file
8. Test if everything worked

## Preparing lambda code

Our lambda will clone public repository and return list of files contained in it. In payload to lambda we will be setting repository name, git user(optional) and git password(optional).

## Adding git binary

We cannot add any binary file to our lambda, it needs to be able to execute on [amzn-ami-hvm-2017.03.1.20170812-x86_64-gp2](https://console.aws.amazon.com/ec2/v2/home#Images:visibility=public-images;search=amzn-ami-hvm-2017.03.1.20170812-x86_64-gp2) AMI, which is mentioned in [documentation](https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html) as currently used execution runtime for lambda. Depending on our use case we can either compile source code on ec2 created from this AMI or install it through `yum` and then copy binary files into our zip file. We will go with the latter.

We will start ec2 instance backed by mentioned AMI. I will use aws-cli to do this but you can move with aws console. Starting ec2 just go get binary file is not most efficient way of handling this situation, but as exercise we can go with it.

First we will need ssh key to log into ec2 (if you have one you can skip it):

```bash
aws ec2 create-key-pair --key-name ec2-key-pair --region eu-central-1
```

You should save value of `KeyMaterial` field e.g in file called `ec2-key-pair.key`

Then we can go with creation of ec2 instance:

```bash
aws ec2 run-instances \
--image-id ami-657bd20a \
--instance-type t2.micro \
--key-name ec2-key-pair \
--count 1 \
--region eu-central-1 \
--associate-public-ip-address \
--output=text \
--query "Instances[*].InstanceId"
```

Now if everything went well you should see ec2 instance id as output, you can paste it to next command:

```bash
aws ec2 describe-instances --output=text --query "Reservations[*].Instances[*].PublicIpAddress" --instance-ids YOUR_INSTANCE_ID --region eu-central-1
```

This gives us public ip address of our instance, now we can ssh into it.

Note: ssh might not work for the first couple of minutes because ec2 instance take some time to spin up, you can check their state in AWS console or with below command:

```bash
aws ec2 describe-instances --output=text --query "Reservations[*].Instances[*].State" --instance-ids YOUR_INSTANCE_ID --region eu-central-1
```

Now we can ssh into out newly created instance:

```bash
ssh -i ec2-key-pair.key ec2-user@YOUR_IP
```

Note: if above commands ends with `ssh: connect to host YOURS_IP port 22: Operation timed out` it might also means that default security group in eu-central-1 region has closed port 22, you should open it before proceeding.

No while we are on logged into machine we need to install git:

```bash
sudo yum install git
```

After installation is completed, we can see where git binary is located by typing `which git` as result we should get `/usr/bin/git` path. So we have main git binary but, git uses additional binaries and in our example we want to clone repository which uses `https` protocol, those files can be found under `/usr/libexec/git-core`, and the file which interests us is called `git-remote-https`.

Lets copy those two files to localhost:

```bash
mkdir git-dir
scp -i ec2-key-pair.key ec2-user@YOUR_IP:/usr/bin/git ./git-dir/
scp -i ec2-key-pair.key ec2-user@YOUR_IP:/usr/libexec/git-core/git-remote-https ./git-dir/
```

After we have git binaries we can prepare our lambda code. Let's create index.js file:

```javscript
'use strict';

const git = require('simple-git/promise');
const fs = require('fs-extra');

// Set up environment variables so "git" command is available
const lambdaRoot = process.env.LAMBDA_TASK_ROOT;
process.env.PATH = `${process.env.PATH}:${lambdaRoot}/git-dir`;
process.env.GIT_TEMPLATE_DIR = `${lambdaRoot}/git-dir/templates`;
process.env.GIT_EXEC_PATH = `${lambdaRoot}/git-dir/libexec`;

// Entry point for lambda call
exports.lambdaHandler = function(event, context) {

    console.log("Starting lambda");

    const { gitUser, gitPassword, repoName } = event;
    let repoUrl = `https://${gitUser}:${gitPassword}@github.com/${repoName}.git`;

    if ( !gitUser && !gitPassword ) {
      repoUrl = `https://github.com/${repoName}.git`;
    }

    // To this directory repository contents will be cloned
    // It must be in /tmp directory otherwise lambda will error with  "fatal: could not create work tree dir 'cloned_code': Read-only file system"
    const destPath = "/tmp/cloned_code"

    console.log("Env variables set, performing clone");
    // execute clone command and print files
    return git()
        .silent(true)
        .clone(repoUrl, destPath)
        .then(() => fs.readdir(destPath))
        .then(console.log);
}

```

You can see that we are setting up `PATH` variable, but also `GIT_TEMPLATE_DIR` and `GIT_EXEC_PATH` which are required by git binary. For our use case `GIT_TEMPLATE_DIR` can point to empty directory. `GIT_EXEC_PATH` should point to directory which will contain `git-remote-https` binary.

Lets init our node project and install dependencies:

```bash
npm init
npm install fs-extra simple-git
```

Now our working directory should have structure as below:

```bash
    |- git-dir
    |   |- libexec
    |   |   |- git-remote-https
    |   |- templates // empty dir
    |   |- git
    |- index.js
    |- package.json
    |- node_modules
```

To ship this lambda we should zip it:

```bash
zip -r lambda-code.zip .
```

Now we need to create lambda role which will allow for its execution:

```bash
aws iam create-role \
--role-name git-clone-lambda-role \
--assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'
```

Copy arn of created role and paste it in below command for the upload zip and lambda creation:

```bash
aws lambda create-function \
--function-name git-clone-lambda \
--runtime nodejs8.10 \
--role ARN_FROM_PREVIOUS_COMMAND \
--handler index.lambdaHandler \
--zip-file fileb://lambda-code.zip
```

And now we can invoke our lambda with following command:

```bash
aws lambda invoke \
--function-name git-clone-lambda \
--payload '{
    "repoName": "piotrjaromin/aws-lambda-git-clone-example"
}' \
output.json
```

That's all, you can see your lambda in aws management console and also create test invocation in there :).

NOTE: Calling this lambda multiple times can return error: `fatal: destination path '/tmp/cloned_code' already exists and is not an empty directory.`. The reason is that, we are not cleaning cloned directory, and despite what we might think of lambda if we run them multiple times in short amount of time we might be learn that they do have some state (although unstable).
