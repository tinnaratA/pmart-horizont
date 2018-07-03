function initLocalStorage(){
    for(var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        console.log(key);
        console.log(JSON.parse(localStorage.getItem(key)));
    }
}

function clearLocalStorage(userid){
    for(var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        if(key.split(".")[0] == userid){
            localStorage.removeItem(key);
        }
    }
}