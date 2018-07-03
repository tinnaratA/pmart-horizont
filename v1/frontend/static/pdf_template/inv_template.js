data = {
    total: 62,
    arrayitem: [
        {
            item: "PCF ไก่หมักซอสพริกไทยดำ  แพ็คละ 1 กก.",
            unit: "Kg",
            unitprice: "62",
            qty: 1,
            price: 62,
        }
    ],
    datetime: "1527757786274",
    delivery: "2018-06-01",
    status: "SCHEDULED",
    customer: "A. ",
    created: "2018-05-31T16:07:50.126Z",
    updated: "2018-05-31T16:07:50.126Z",
    id: "ORD7507246849",
    _id: "1eCuTewIg9Zcr7B0",
    payment: "kbank",
    payment_ref: "114155989161",
    vendor: "พีซี ฟูดส์ เซ็นเตอร์",
    po: {
        id: "PO7507246849",
        status: "RAISED",
    },
}


// =========== FUNCTION ============

addToTable = table => data => {
    $('#'+table +' > tbody').append(
        '<tr>'+
        Object.values(data).map(col => '<td>'+col+'</td>').join('')+
        '</tr>'
    );
}
addTotal = table => (total) => $('#'+table +' > tfoot').append(
    `<tr>
        <td colspan="5" style="text-align: right;">Grand Total</td>
        <td>`+total+`</td>
    </tr>`
);




// Add Items
no = 1;
data.arrayitem
.map(item => Object.assign({no: (no++).toString()}, item))
.map(item => { Object.keys(item).map(col => { if(item[col].toFixed) item[col] = item[col].toFixed(2) });  return item} )
.map(addToTable('invoice_item'))

// Add Total

addTotal('invoice_item')('2021.44')

