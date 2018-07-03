to_local_time = (time) => {
    var d = new Date(time);
    var offset = (new Date().getTimezoneOffset() / 60) * -1 * 3600 * 1000;
    var n = new Date(d.getTime() + offset);
    return n.toISOString();
}

set_object_timestamp = (obj) => {
    obj['created'] = to_local_time(new Date());
    obj['updated'] = to_local_time(new Date());
    return obj
}


module.exports = {
    toLocalTime: to_local_time,
    setObjectTimeStamp: set_object_timestamp
}