function sort_array(list, key=null){
    if(key){
        return list.sort((a, b) => {
            if(a[key] < b[key]) return -1;
            if(a[key] > b[key]) return 1;
            return 0;
        });
    }else{
        return list.sort();
    }
};

module.exports = {
    sortArray: sort_array
};
