
```

# Create a SignalR account.

SIGNALR_SERVICE_NAME=msl-sigr-signalr$(openssl rand -hex 5)

az signalr create \
  --name $SIGNALR_SERVICE_NAME \
  --resource-group learn-2f2b6d9f-aef1-45b5-ad27-62a67c9eaaaa \
  --sku Free_DS2 \
  --unit-count 1


# For SignalR Service to work properly with Azure Functions, you need to set its service mode to Serverless. 
# Configure the service mode using the following command.
az resource update \
  --resource-type Microsoft.SignalRService/SignalR \
  --name $SIGNALR_SERVICE_NAME \
  --resource-group learn-2f2b6d9f-aef1-45b5-ad27-62a67c9eaaaa \
  --set properties.features[flag=ServiceMode].value=Serverless

# update local settings
SIGNALR_CONNECTION_STRING=$(az signalr key list \
  --name $(az signalr list \
    --resource-group learn-2f2b6d9f-aef1-45b5-ad27-62a67c9eaaaa \
    --query [0].name -o tsv) \
  --resource-group learn-2f2b6d9f-aef1-45b5-ad27-62a67c9eaaaa \
  --query primaryConnectionString -o tsv)

printf "\n\nReplace <SIGNALR_CONNECTION_STRING> with:\n$SIGNALR_CONNECTION_STRING\n\n"

```



