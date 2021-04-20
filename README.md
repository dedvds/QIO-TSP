# Quantum Inpired Optimization demo for the TSP problem

This website can be used as a demo to show how Qauntum Inspired Compute can solve the Traveling Salesperson problem using an interactive map.

## Requirements
1. An Azure subscription with a Quantum Workspace. 
2. A Bing Maps API key. If you don't have one, follow [these](https://docs.microsoft.com/en-us/bingmaps/getting-started/bing-maps-dev-center-help/getting-a-bing-maps-key) instructions.


## How to use

### Local

For the application settings you need to create a `.env` file in the root folder specifying following variables:

```
#These are the settings for your Azure Quantum Workspace
subscriptionId = 000000-000000-000000-000000-000000
resourceGroup = MY_RESOURCE_GROUP
quantumWorkspaceName = myworkspace
quantumLocation = westeurope

#these settings can be used if you are using a service principal to authenticate
directoryId = 000000-000000-000000-000000-000000
appId = 000000-000000-000000-000000-000000
appsecret = 000000-000000-000000-000000-000000

#Bingmaps API key.
bingkey = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

#You can set a password here if you want to use one otherwise leve blank
password = supersecretpass

# set as servicePrincipal if you want to use this to authenticate otherwise leave blank
loginMethod = servicePrincipal
```

First, add the Bing API key to the Bing url in the [html file](./public/index.html). Then debug the application in VSCode with the `Fastapi` setting [(example)](https://fastapi.tiangolo.com/tutorial/first-steps/), this loads the variables declared in the `.env` file.

### On Azure

If you want to deploy this to Azure app service you can deploy this by running the included pipeline, it can be setup like this:

1. Prepare the Azure enviorment.
    A. Create a Linux Python app service plan.
    B. Fetch the publish profile, you can do this by going the the App service in the Azure portal and click on `Get publish profile`.
    C. Create an Azure Quantum workspace.
    D. Add a service principle account to the Azure Quantum workspace like [this](https://docs.microsoft.com/en-us/azure/quantum/optimization-authenticate-service-principal). Note down the service principle information including the secret.


2. Fork this project.
3. Navigate to the settings page and then the secrets tab.
4. Add a new secret named `DEPLOYMENT_PROFILE`, paste the contents of the deployment profile there. Then add another new secret named `BING_KEY` and assign it the Bing Maps API key. 
5. Add the same settings as the in above `.env` file as application settings in the App service like [this](https://docs.microsoft.com/nl-nl/azure/app-service/configure-common).
6. Run the github action.
7. Have fun =).
