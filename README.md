# backend-capstone-template
# ChatGPT Devs Era


ChatGPT Devs Era is a website, customers can browse through various cooks and their menus, discovering a wide range of homemade food options. They can easily place orders for the meals they desire and have them delivered or arrange for pick-up.
For Cooks, the platform provides a simple way to create profiles and showcase their homemade dishes. They can manage their menu, track orders, and interact with their customers.

## Table of Contents

- [Purpose](#purpose)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)


## Purpose

1.	Connect customers with cooks who offer homemade food.
2.	Support local cookers and help customers who are looking for homemade food



## Features

1.	Connects customers with local cooks offering homemade food.
2.	Browse and explore a diverse range of homemade dishes.
3.	User-friendly interface for placing and managing orders.
4.	Profiles for cooks to showcase their culinary offerings.
5.	Order tracking and communication between customers and cooks.

## Installation

To install ChatGPT Devs Era, you can use yarn:

```bash
yarn install chatgpt-devs-era
```

### To start the server

run the command `yarn && yarn start`. This will install all the dependencies

### To run the tests

run the command `yarn test`. Make sure that the server is up and running as well as the database

### To install packages

when you run `yarn add PACKAGE` the package will be installed in docker as well automatically. However if you run into issues, you need to stop the server first with `yarn run stop` then you can run `yarn run build` to rebuild the docker image and start again.

## Usage

To interact with the backend server, you can make HTTP requests to the following endpoints. The base URL for all endpoints is http://localhost:3000/api.

Endpoints
1. Create Normal User (Signup)
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

2. Login Normal User
Description: Authenticates the normal user and generates an access token for subsequent requests.
Endpoint: /auth/login
Method: POST
Request Body:
```json
{
    "email": "",
    "newPassword": ""
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
    "password": ""
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
  "address": ""
}
```

9. Retrieve Chef information
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

10. Edit Chef Profile
Description: Allows the authenticated chef to edit their profile information.
Endpoint: /chef/me
Method: PUT
Request Body:
```json
{
  "restaurant": ""
}
```

11. Retrieve Chefs by a client
Description: Retrieves a list of all chefs by a client.
Endpoint: /chefs
Method: GET
Request Body:
```json
{
 
}
```

12. Retrieve Chef Dishes by chef
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

13. Retrieve Client's Favorite Dishes
Description: Retrieves a list of dishes favorited by the authenticated client.
Endpoint: /clients/me/favorite-dishes
Method: GET
Request Body:
```json
{
  
}
```

14. Add Dish to Client's Favorite Dishes
Description: Adds a dish to the list of favorite dishes for the authenticated client.
Endpoint: /clients/me/favorite-dishes
Method: POST
Request Body:
```json
{
  "dishId": ""
}
```

15. Retrieve Client's Order History
Description: Retrieves the order history of the authenticated client.
Endpoint: /clients/me/order-history
Method: GET
Request Body:
```json
{
  
}
```

16. Delete Dish from Client's Favorite Dishes
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

17. Create Order
Description: Creates a new order for the authenticated client.
Endpoint: /orders
Method: POST
Request Body:
```json
{
  
}
```
18. Create Chef Profile
Description: Allows a user to create a chef profile to showcase their culinary offerings.
Endpoint: /chef/
Method: POST
Request Body:
```json
{
  {
    "restaurant": "",
    "location": "",
    "openingHours": "",
    "closingHours": "",
    "contactNumber": "",
    "description": ""
}
}
```


## Examples

Here are some examples of how you can interact with the backend API using various endpoints:

Example 1: Creating a new normal user account

```bash
curl -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d '{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "secure_password",
  "role": "normal"
}'
```


## Contributing

Thank you for considering contributing to the ChatGPT Devs Era! If you'd like to contribute, please follow these guidelines:

1.Fork the repository and create your branch from the main branch.
2.Make your changes, improvements, or fixes in the codebase.
3.Ensure your code follows the project's coding conventions and style guidelines.
4.Write clear and concise commit messages explaining the changes you made.
5.Once your changes are ready, submit a pull request to the main repository.
6.Your pull request will be reviewed by the maintainers, and any necessary feedback will be provided.
7.After addressing any requested changes, your contribution will be merged into the main branch, and you'll become part of the project's contributors!


## License

The ChatGPT Devs Era is licensed under the MIT License.

The MIT License is a permissive open source license that allows you to use, modify, distribute, and sublicense the software. It is a widely used license in the open source community and provides the flexibility for developers and users to use the software for various purposes.

Before contributing to or using the Cookiz app, please make sure to review the full license terms in the LICENSE file in the project's repository
