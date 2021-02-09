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

    # Azure Cosmos DB is used to store stock prices. 
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
    
    # install the package using npm install
    # This will install using package.json and setup the database (see setup.js)
    npm install

    # Type F5 to run the function app. This is the server(less) piece or the "backend" piece.
    # The front end web app will hit the backend function app to retrieve data. 
    # To run the front end web app open another terminal and type
    npm start

    # The browser hits the web server/app running on port 8080 asking for the stocks. 
    # The web app hits the function app (port 7071) to get the stocks data and builds the view to be returned to the browser.
    # CORS relaxes the "same origin policy" to allow the web app to talk to the function app 

    # to manipulate the stock prices run . . . 
    npm run update-data 


```

# Analysis of polling solution

## Pros

- Simple solution.

## Cons

- Client app contacts server whether stock prices have changed or not.
- All stocks are updated on the web page regardless of what actually changed. 
- Time based polling will see delays in changes appearing. If the interval is too short 
  then there may be many unnecessary req/resp exchanges -> wasted resources and server
  taxed more than necessary especially under heavy load. 


