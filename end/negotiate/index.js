module.exports = async function (context, req, connectionInfo) {
    // SignalR connection is returned as the response
    context.res.body = connectionInfo;     
};
