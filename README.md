# Service Fabric Migration Demos
This sample code was used in [Microsoft Virtual Academy Service Fabric Live Event] (https://mva.microsoft.com/liveevents/azure-service-fabric-patterns-and-practices) Migration Session. The code consists of:

1. Simple Web Application 
2. Web App + single instance Compute 
3. Web App connecting to a backend service (with internal load balancer) + single instance Compute + Service Fabric health reporting.

All applications are running as is (Service Fabric Guest Executable). Please view the session for more details. 

> note: I am not maintaining this repo, Its here for reference only.


# Deploying/Removing app applications


> Your cluster should have external load balancer with port 9001 configured for routing to cluster nodes

``` 
    # Deploy to local cluster  
.\scripts\deploy-app.ps1 -AppName {app0|app1|app2} -UseLocalCluster

    #Deploy to cloud 
    #    - Modify deploy and remove script with cloud cluster endpoint and certificate
    #    - run:

.\scripts\deploy-app.ps1 -AppName {app0|app1|app2}

    # The script remove-app.ps1 follows the same semantics exactly and removes the app from the cluster. 

```


# Testing the applications 

```
    # Cloud 
curl http://<cluster FQDN>.<Azure Region>.cloudapp.azure.com:9001/api/app # routed to the app REST api
curl http://<cluster FQDN>.<Azure Region>.cloudapp.azure.com:9001/index.html # routed to express static content
 
    #localhost 
curl http://localhost.cloudapp.azure.com:9001/api/app # routed to the app REST api
curl http://localhost.cloudapp.azure.com:9001/index.html # routed to express static content
```


# Notes on Running Apps

1. App0 runs as is with no modification from your side. 
2. App1 will require changes to /app1/ComputeSvc/Code/app.js to add azure storage account details for stdout redirect. 
3. App2 will require the same modification as App1 + adding keys details for calling Service Fabric Rest Endpoint. in addition to that it will need an internal azure load balancer (on ip 10.0.0.9) to work correctly. 



# Additional Resources

1. Creating Azure internal load balancer using Azure CLI [](https://azure.microsoft.com/en-us/documentation/articles/load-balancer-get-started-ilb-arm-cli/)
2. Follow these steps to add additional load balancer to VMSS network profile [](http://jasonpoon.ca/2016/08/23/adding-a-load-balancer-to-your-virtual-machine-scale-set/) 
