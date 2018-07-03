var logger = (severity, message, status=null) => {
    var ts = new Date();
    var severity = severity.toUpperCase()
    if(status)
        console.log('%s - %s - %s - %s', severity, ts.toISOString(), message, status);
    else
        console.log('%s - %s - %s', severity, ts.toISOString(), message);
}

module.exports = logger;