# Replace resource group names, etc as needed. 

```
    # Azure Functions require a storage account.

    $ export STORAGE_ACCOUNT_NAME=mslsigrstorage$(openssl rand -hex 5)
    $ echo "Storage Account Name: $STORAGE_ACCOUNT_NAME"

    $ az storage account create \
    --name $STORAGE_ACCOUNT_NAME \
    --resource-group <myrg> \
    --kind StorageV2 \
    --sku Standard_LRS

    # Keep note of the name of this storage account. 

    # Azure Cosmos DB is used to store stonk prices. 
    az cosmosdb create  \
    --name msl-sigr-cosmos-$(openssl rand -hex 5) \
    --resource-group <myrg>

    # Need proper connection strings to connect to cloud services.

    STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
    --name $(az storage account list \
    --resource-group <myrg> \
    --query [0].name -o tsv) \
    --resource-group <myrg> \
    --query "connectionString" -o tsv)

    COSMOSDB_ACCOUNT_NAME=$(az cosmosdb list \
    --resource-group <myrg> \
    --query [0].name -o tsv)

    COSMOSDB_CONNECTION_STRING=$(az cosmosdb list-connection-strings  \
    --name $COSMOSDB_ACCOUNT_NAME \
    --resource-group <myrg> \
    --query "connectionStrings[?description=='Primary SQL Connection String'].connectionString" -o tsv)

    COSMOSDB_MASTER_KEY=$(az cosmosdb list-keys \
    --name $COSMOSDB_ACCOUNT_NAME \
    --resource-group <myrg> \
    --query primaryMasterKey -o tsv)

    printf "\n\nReplace <STORAGE_CONNECTION_STRING> with:\n$STORAGE_CONNECTION_STRING\n\nReplace <COSMOSDB_CONNECTION_STRING> with:\n$COSMOSDB_CONNECTION_STRING\n\nReplace <COSMOSDB_MASTER_KEY> with:\n$COSMOSDB_MASTER_KEY\n\n"


    # Using the output update the local.settings.json file appropriately. 
    # In this way the app on the local machine to connect to the components that are remote in the cloud.
    

```



