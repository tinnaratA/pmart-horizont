# pmart-horizont
p-mart co, ltd horizont drive through project
this project will be divided into 3 sub folder which are

- Backend 
- Frontend
- EAI


## Backend (Saleor)

Backend is the systems provided by Saleor. This is the main entrance of all items and pricing.
The location information from the project and POS will sent to here to update data as well as
preorder data will be send from this backend.

Backend will consists of PostgreSQL to keep data and Django to act as an interface for the customers from outside

#### Incoming Update Stock Data

Incoming msg for update stocks will be like JSON below


{
    "location": "CHIANGMAI_A01",
    "itemlist":[
        {
            "sku": "124-24123",
            "name": "ไก่แช่แข็ง",
            "unit": "kg",
            "unitprice": 214,
            "qty": 252,
        },
        {
            "sku": "124-24124",
            "name": "PMART สันนอกหมูแล็ป",
            "unit": "kg",
            "unitprice": 224,
            "qty": 111,
        },
        {
            "sku": "124-24125",
            "name": "PMART หมูเบคอนสด",
            "unit": "kg",
            "unitprice": 124,
            "qty": 252,
        }
    ]
}


#### Message from Saleor

Message from saleor to EAI will be this specs


{
        "customer_name": "Somchai",
        "customer_id": "CUST0001",
        "orderitem": [
            {
                "sku": "124-24123",
                "name": "ไก่แช่แข็ง",
                "unit": "kg",
                "unitprice": 214,
                "qty": 4,
                "total" : 856
            },
            {
                "sku": "124-24122",
                "name": "ไก่แช่แข็ง",
                "unit": "kg",
                "unitprice": 214,
                "qty": 4,
                "total" : 856
            }
        ]
        "total": 1702,
        "location": "CHIANGMAI_A01",
        "pickupdatetime": 1530538063,
        "created": 1530538003,
}