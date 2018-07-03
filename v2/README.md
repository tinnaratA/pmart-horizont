# pmart-horizont
p-mart co, ltd horizont drive through project
this project will be divided into 3 sub folder which are

- cores 
- preorder


## Cores 

Backend is the systems provided by Saleor. This is the main database of all items and pricing.
The location information from the project and POS will sent to here to update data as well as
preorder data will be send from this backend.

Backend will consists of PostgreSQL to keep data and Django to act as an interface for the customers from outside

This is also an orchestrative program to direct all of the requests and manage all of the data. The preorder from backend Saleor will direct to EAI and EAI will generate SMS as well as send an update to the front to manage data 


## Preorder (Nodejs)

This is the application for backoffice to manage all of the incoming preorder. Clerks will use this systems to manage and pack all of the goods and ready for the customer to pickup the goods by customers using pin code.



# Prerequisite

- Node JS Version 8+
- Python Version 3.6+
- PostgreSQL
