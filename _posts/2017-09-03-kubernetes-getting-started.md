---
layout: post
title:  "Kubernetes - getting started"
date:   2017-09-10 17:03:06 +0200
categories: kubernetes tutorial pod service docker
tags: kubernetes tutorial pod service docker
---

Kubernetes or k8s in short is tool to orchestrate docker (and rkt) containers. By default docker containers are run on single machine if we want to run multiple nodes with different applications we would have to run them manually on each node, which can be really tiring when we have hundreds or thousands of nodes. Also monitoring, managing, log aggregation become really complicated tasks. Because of that orchestration tools have been developed like kubernetes, docker swarm, amazon ECS, azure container service, google container engine.  

What kubernetes allows us to create master node, which will control all slave nodes that are connected to it. On those slave nodes we can deploy pods. Pods are either one or more containers, along with storage resources and IP (by documentation "pod is a single instance of an application in Kubernetes"). Pods can be exposed to external world or other pods by services, which are load balancing traffic. ReplicaSets are responsible for scaling up/down instances. 

Pods, services, replicaSets are objects in kubernetes api, they are entries stored in etcd database on k8s api server. Controllers are monitoring those objects so whenever property of object is changed, controller will execute operation to make this change valid in k8s cluster. For e.g. change to number of instances in replicaSet, will trigger controller and destroy or create new instances of pod.

Other builtin kubernetes api objects are:
- Deployment - controls pods and replicaSets
- DaemonSet - ensures that pod is run on every node (e.g. pod responsible for collecting logs)
- Volume - persistence layer, allows pod to store files and share them
- Namespace - allow to splitting physical cluster into "virtual clusters", for e.g. to allow different development teams to work without mixing their applications.

Each of those objects have api version, if version contains alpha text then it might be changed without notice, about changes in beta we are notified in advance.

With custom resource definitions there is possibility of creating our own object definitions.

Kubernetes can be controller through command line tool called kubectl or by web api. 

## Minikube
Minikube is tool created for local development, it allows for creation of single node cluster of k8s. It creates preconfigured virtual machine with everything set up.

Here is install [link](https://kubernetes.io/docs/tasks/tools/install-minikube/), kubectl installation instructions can also be found there.

To start minikube instance:
```bash
minikube start
```

To stop:
```bash
minikube stop
```

## Listing resources

To List existing resource we can use
```bash
kubectl get resource_group
```

where ```resource_group``` can be for e.g. pods, services, deployments, replicasets, nodes.
Each of those resources have short aliases like po, svc, deploy, rs.

Operating on single resource
```bash
kubectl get/delete/describe resource_group/name
```

Where name can be obtained from resource list mentioned earlier.

## Kubectl deploy application

Ceate new deployment with one pod instance and docker image called ```kieper/hellozz```.
We are also passing environemnt variable called ```HELLO_NAME``` and value ```"from my first app"```.
Replicas inform of how many pods we want to create.

```bash
kubectl run hello-deployment --image=kieper/hellozz --replicas=1 --env="HELLO_NAME=from my first app" 
```

Now we cane expose our deployment as LoadBalancer type, ```kieper/hellozz``` is listening on port 3000
so we are providing this as port value. 
```bash
kubectl expose deployment hello-deployment --type=LoadBalancer --name hello-service --port=3000
```

We can increase amount of running pods
```bash
kubectl scale --replicas=3 deployment hello-deployment
```

Also entering inside running docker container is possible with below command
hello-deployment-XXXXX should be replaced with pod name, pod names cane be found by calling ```kubectl get pods```

```bash
kubectl exec -it hello-deployment-XXXXX bash
```

To reach our service on minikube we can call:
```bash
minikube service --url hello-service
```

In return we will get address under which hellozz service is exposed

to clean up
```bash
kubectl delete deploy hello-deployment
kubectl delete svc hello-service
```

Deleting deployments will also delete pods.

## Yaml deploy application

Operations done in previous step can also be achieved by creating yaml files.

For deployment: deployment.yaml
```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: hello-deployment
spec:
  replicas: 3
  template:
    metadata:
      labels:
        run: hello-deployment
    spec:
      containers:
      - env:
        - name: HELLO_NAME
          value: my first app
        image: kieper/hellozz
        imagePullPolicy: Always
        name: hello-deployment
```

For service: service.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-service
spec:
  ports:
  - port: 3000
    protocol: TCP
    targetPort: 3000
  selector:
    run: hello-deployment
  type: LoadBalancer
```

To create them in kubernetes cluster
```bash
kubectl create -f deployment.yaml
kubectl create -f service.yaml
```

to apply changes after modifying to files replace ```create``` with ```apply```
