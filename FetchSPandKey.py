from azure.common.credentials import ServicePrincipalCredentials
from azure.quantum import Workspace
import os

def SPLogin():
    quantumWorkspace ={}
    try:
        quantumWorkspace = Workspace (
            subscription_id = os.environ.get('subscriptionId'),  # Add your subscription_id
            resource_group = os.environ.get('resourceGroup'),   # Add your resource_group
            name = os.environ.get('quantumWorkspaceName'),              # Add your workspace name
            location= os.environ.get('quantumLocation')           # Add the workspace location, for example, westus
        )
        if(os.environ.get('loginMethod') == 'servicePrincipal'):
            quantumWorkspace.credentials = ServicePrincipalCredentials(
                tenant    = os.environ.get('directoryId'),                            # From service principal creation, your Directory (tenant) ID
                client_id = os.environ.get('appId'),                                  # From service principal creation, your Application (client) ID
                secret    = os.environ.get('appsecret'),                              # From service principal creation, your secret
                resource  = "https://quantum.microsoft.com"         # Do not change! This is the resource you want to authenticate against - the Azure Quantum service
            )
        else:
            quantumWorkspace.login() #If you do not want to use service prinipal login you can use the interactive browser login
    except:
        KeyError('Failed to login with service principal')
    
    quantumWorkspace.login()

    return quantumWorkspace



def FetchBingMapsKey():
    try:
        BingMapsAPIKey = os.environ.get('bingkey')                                         # Fetch Bing API key
    except:
        raise KeyError('Bing Maps API key not found')

    return BingMapsAPIKey

