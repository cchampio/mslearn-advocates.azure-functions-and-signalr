module.exports = async function (context, documents) {

    // Input trigger is cosmos db change feed.
    // The documents param contains the stocks that changed.
    const updates = documents.map(stock => ({
        target: 'updated',
        arguments: [stock]
    }));

    // broadcast the changes to the signalr server
    context.bindings.signalRMessages = updates;
    context.done();
}
