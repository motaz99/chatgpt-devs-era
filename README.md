# backend-capstone-template
# Cookiz


Cookiz is a website, customers can browse through various cooks and their menus, discovering a wide range of homemade food options. They can easily place orders for the meals they desire and have them delivered or arrange for pick-up.
For Cooks, the platform provides a simple way to create profiles and showcase their homemade dishes. They can manage their menu, track orders, and interact with their customers.

## Table of Contents

- [Purpose](#purpose)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)


## Purpose

1.	Connect customers with cooks who offer homemade food.
2.	Support local cookers and help customers who are looking for homemade food



## Features

1.	Connects customers with local cooks offering homemade food.
2.	Browse and explore a diverse range of homemade dishes.
3.	Profiles for cooks to showcase their culinary offerings.
4.	Order tracking and communication between customers and cooks.

## Installation

To install Cookiz, you can :
Setup-cookiz app and we can use this steps:

- clone the repo into your local using 'git clone repo-url'
- do 'yarn install' to install the needed dependencies

### To start the server

run the command `yarn start`. This will install all the dependencies

### To run the tests

run the command `yarn test`. Make sure that the server is up and running as well as the database

### To install packages

when you run `yarn add PACKAGE` the package will be installed in docker as well automatically. However if you run into issues, you need to stop the server first with `yarn run stop` then you can run `yarn run build` to rebuild the docker image and start again.

## Usage

To interact with the backend server, you can make HTTP requests to the following endpoints. The base URL for all endpoints is http://localhost:3000/api.

Endpoints
1. Create User (Signup)
Description: Creates a new normal user account.
Endpoint: /auth/signup
Method: POST
Request Body:
```json
{
    "firstname": "",
    "lastname": "",
    "email": "",
    "password": "",
    "role": ""
}
```

2. Login User
Description: Authenticates the normal user and generates an access token for subsequent requests.
Endpoint: /auth/login
Method: POST
Request Body:
```json
{
    "email": "",
    "password": ""
}
```

3. Password Reset
Description: Initiates the password reset process for a user.
Endpoint: /auth/passwordReset
Method: POST
Request Body:
```json
{
    "email": "",
    "newPassword": ""
}
```
4. Logout
Description: Logs out the currently logged-in user and invalidates the access token.
Endpoint: /auth/logout
Method: POST

5. Decide User Role
Description: Allows the system to assign a role to a user, based on certain criteria or user preferences.
Endpoint: /role
Method: PUT
Request Body:
```json
{
    "providerId": "",
    "role": "client"
}
```

6. Create Client Profile
Description: Creates a new client profile.
Endpoint: /clients/
Method: POST
Request Body:
```json
{
  "address": "",
  "contactNumber": ""
}
```

7. Get Client Profile
Description: Retrieves the profile of the authenticated client.
Endpoint: /clients/me
Method: GET
Request Body:
```json
{
  
}
```

8. Update Client Profile
Description: Updates the profile of the authenticated client.
Endpoint: /clients/me
Method: PUT
Request Body:
```json
{
  "address": "",
  "contactNumber":""
}
```


9. Retrieve Chefs by a client
Description: Retrieves a list of all chefs by a client.
Endpoint: clients/chefs
Method: GET
Request Body:
```json
{
 
}
```
10. Add Dish to Client's Favorite Dishes
Description: Adds a dish to the list of favorite dishes for the authenticated client.
Endpoint: /clients/me/favorite-dishes
Method: POST
Request Body:
```json
{
  "dishId": ""
}
```

11. Retrieve Client's Favorite Dishes
Description: Retrieves a list of dishes favorited by the authenticated client.
Endpoint: /clients/me/favorite-dishes
Method: GET
Request Body:
```json
{
  
}
```

12. Delete Dish from Client's Favorite Dishes
Description: Deletes a dish from the list of favorite dishes for the authenticated client.
Endpoint: /clients/me/favorite-dishes/:id
Method: DELETE
Parameters:
id (required): The ID of the dish to remove from favorites.
Request Params:
```json
{
  "dishId": ""
}
```

13. Retrieve Client's Order History
Description: Retrieves the order history of the authenticated client.
Endpoint: /clients/me/order-history
Method: GET
Request Body:
```json
{
  
}
```
14. Dish Ratings by Client
Description: Allows a client to submit ratings for a dish.
Endpoint: /clients/rating-dish/:id
Method: POST
Parameters:
id (required): The ID of the dish to rate.
Request Body:
```json
{
  "rating": ""
}
```

15. Get Chef Dishes by Client
Description: Retrieves a list of dishes offered by a specific chef, based on a client's preferences.
Endpoint: /clients/chefs/dishes/:id
Method: GET
Parameters:
id (required): The ID of the chef to retrieve dishes from.

16. Get Chef By Id
Description: Retrieves information about a specific chef by their ID.
Endpoint: /clients/chefs/:id
Method: GET
Parameters:
id (required): The ID of the chef to retrieve.

17. Create Chef Profile
Description: Allows a user to create a chef profile to showcase their culinary offerings.
Endpoint: /chef/
Method: POST
Request Body:
```json
{
  
    "restaurant": "",
    "location": "",
    "openingHours": "",
    "closingHours": "",
    "contactNumber": "",
    "description": ""

}
```

18. Edit Chef Profile
Description: Allows the authenticated chef to edit their profile information.
Endpoint: /chef/me
Method: PUT
Request Body:
```json
{
  "restaurant": ""
}
```

19. Retrieve Chef information
Description: Retrieves the profile of a chef Chef information based on their ID.
Endpoint: /chef/me
Method: GET
Parameters:
id (required): The ID of the chef to retrieve.
Request Body:
```json
{

}
```

20. Retrieve Chef Dishes by chef
Description: Retrieves a list of dishes offered by a certain chef.
Endpoint: /chefs/:id/dishes
Method: GET
Parameters:
id (required): The ID of the chef to retrieve dishes from.
Request Body:
```json
{
  
}
```

21. Create Dish
Description: Allows a chef to create a new dish and add it to their culinary offerings.
Endpoint: /chef/dish
Method: POST
Request Body:
```json
{
  
    "name": "",
    "description": "",
    "price": "",
    "rating": ""

}
```
21. Get All Dishes
Description: Retrieves all dishes offered by the chef.
Endpoint: /chef/dish
Method: GET

22. Get Dish By Id
Description: Retrieves a specific dish by its ID.
Endpoint: /chef/dish/:id
Method: GET
Parameters:
id (required): The ID of the dish to retrieve.

23. Delete Dish By Id
Description: Deletes a specific dish by its ID.
Endpoint: /chef/dish/:id
Method: DELETE
Parameters:
id (required): The ID of the dish to delete.

24. Create Order
Description: Creates a new order for the authenticated client.
Endpoint: /orders
Method: POST
Request Body:
```json
{
  
}
```
25. Client Cancel Order
Description: Allows a client to cancel an order they previously placed.
Endpoint: /orders/cancel-order/:id
Method: DELETE
Parameters:
id (required): The ID of the order to cancel.

26. Get Chef Orders
Description: Retrieves a list of orders received by a specific chef.
Endpoint: /orders/chef-orders
Method: GET

28. Chef Update Order Status
Description: Allows a chef to update the status of an order they are handling.
Endpoint: /orders/chef-update-order-status
Method: PUT
Request Body:
```json
{
  "status": ""
}
```



## Examples

Here are some examples of how you can interact with the backend API using various endpoints:

1. Example: Creating a new normal user account

```bash
curl -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d '{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "secure_password",
  "role": "chef"
}'
```

2. Example: Creating a new client profile

```bash
curl -X POST http://localhost:3000/clients/ -H "Authorization: Bearer <access_token>" -H "Content-Type: application/json" -d '{
  "address": "123 Main Street",
  "contactNumber": "555-123-4567"
}'
```

3. Example : Retrieving the client's order history

```bash
curl -X POST http://localhost:3000/orders -H "Authorization: Bearer <access_token>" -H "Content-Type: application/json" -d '{
  "items": [
    { "dishId": "<dish_id>", "quantity": 2 },
    { "dishId": "<dish_id>", "quantity": 1 }
  ]
}'
``` 


## Contributing

Thank you for considering contributing to the Cookiz! If you'd like to contribute, please follow these guidelines:

1. Fork the repository and create your branch from the main branch.
2. Make your changes, improvements, or fixes in the codebase.
3. Ensure your code follows the project's coding conventions and style guidelines.
4. Write clear and concise commit messages explaining the changes you made.
5. Once your changes are ready, submit a pull request to the main repository.
6. Your pull request will be reviewed by the maintainers, and any necessary feedback will be provided.
7. After addressing any requested changes, your contribution will be merged into the main branch, and you'll become part of the project's contributors!
