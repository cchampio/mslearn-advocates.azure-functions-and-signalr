// URL of the function app
const LOCAL_BASE_URL = 'http://localhost:7071';
const AZURE_BASE_URL = '<FUNCTION_APP_ENDPOINT>';

const getAPIBaseUrl = () => {
    const isLocal = /localhost/.test(window.location.href);
    return isLocal ? LOCAL_BASE_URL : AZURE_BASE_URL;
}

const app = new Vue({
    el: '#app',
    data() { 
        return {
            stocks: []
        }
    },
    methods: {
        async getStocks() {
            try {
                const apiUrl = `${getAPIBaseUrl()}/api/getStocks`;
                const response = await axios.get(apiUrl);
                console.log('Stocks fetched from ', apiUrl);
                app.stocks = response.data;
            } catch (ex) {
                console.error(ex);
            }
        }
    },
    created() {
        this.getStocks();
    }
});

// When the page loads the connect function is called.
const connect = () => {
    // Use the SignalR sdk to create a connection
    // This results in a connection to the SignalR server. 
    const connection = new signalR.HubConnectionBuilder().withUrl(`${getAPIBaseUrl()}/api`).build();

    connection.onclose(()  => {
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
    });

    // Listen for SignalR messages and update the stock as they occur.
    connection.on('updated', updatedStock => {
        const index = app.stocks.findIndex(s => s.id === updatedStock.id);
        app.stocks.splice(index, 1, updatedStock);
    });

    connection.start().then(() => {
        console.log("SignalR connection established");
    });
};

connect();
