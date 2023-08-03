# Cookiz  

Welcome to Cookiz, a platform connecting food enthusiasts with local cooks who offer a delightful array of authentic homemade dishes. Clients can effortlessly browse through various cooks and their menus, discovering a wide range of homemade food options. For cooks, it provides a simple way to create profiles, showcase their culinary creations, manage menus, and track orders.  

Placing orders for the meals they desire is seamless, and delivery is a breeze. Cookiz seamlessly bridges the gap between those who crave exceptional homemade meals and the skilled cooks who bring them to life.

## Table of Contents

- [Purpose](#purpose)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#apidocumentation)
- [Contributing](#contributing)


## Purpose

1.	Connect customers with talented local cooks who offer a diverse selection of homemade dishes.
2.	Support local cooks by providing them a platform to showcase their culinary creations and skills.



## Features

1. Cooks can create detailed profiles showcasing their restaurant and culinary specialties.
2. Cooks can upload a variety of homemade dishes to their menus.
3. Cooks and customers can track the status of orders, from preparation to delivery.
4. Customers can browse and explore a diverse range of homemade dishes.
5. Customers can add favorite dishes in their profile.
6. Customers can provide ratings for dishes they've ordered.

## Installation

Setting up the Cookiz app is a breeze. Follow these steps:

- Clone the repository to your local machine using 'git clone repo-url'.
- Execute 'yarn install' to install the necessary dependencies.

### To start the server

Run the command `yarn start`. This will install all the required dependencies.

### To run the tests

Execute the command `yarn test`. Ensure that both the server and the database are up and running.

### To install packages

When you run `yarn add PACKAGE`, the package will be automatically installed in Docker as well. If you encounter any issues, stop the server first using `yarn run stop`, then rebuild the Docker image with `yarn run build` before starting again.

## Usage

Interact with the backend server by making HTTP requests to the following endpoints.  
The base URL for all endpoints is: http://localhost:3000/api

**Endpoints**  

**1. Sign Up**  
Description: Creates a new user account  
Endpoint: `/auth/signup`  
Method: POST  
Request Body:
```json
{
    "firstname": "Taylor",
    "lastname": "Smith",
    "email": "taylor.smith@email.com",
    "password": "Password1",
    "role": ""
}
```

**2. Login**  
Description: Authenticates the user and generates an access token for subsequent requests  
Endpoint: `/auth/login`  
Method: POST  
Request Body:
```json
{
    "email": "taylor.smith@email.com",
    "password": "Password1"
}
```

**3. Password Reset**  
Description: Initiates the password reset process for a user  
Endpoint: `/auth/passwordReset`  
Method: POST  
Request Body:
```json
{
    "email": "taylor.smith@email.com",
    "newPassword": "Newpassword1"
}
```
**4. Logout**  
Description: Logs out the currently logged-in user and invalidates the access token  
Endpoint: `/auth/logout`  
Method: POST  

**5. Decide User Role**  
Description: Allows the system to assign a role to a user, based on certain criteria or user preferences  
Endpoint: `/role`  
Method: PUT  
Request Body:
```json
{
    "providerId": "",
    "role": "client"
}
```

**6. Create Client Profile**  
Description: Creates a new client profile  
Endpoint: `/clients/`  
Method: POST  
Request Body:
```json
{
  "address": "Example St.",
  "contactNumber": "+99999999"
}
```

**7. Get Client Profile**  
Description: Retrieves the profile of the client  
Endpoint: `/clients/me`  
Method: GET  

**8. Update Client Profile**  
Description: Updates the profile of the client  
Endpoint: `/clients/me`  
Method: PUT  
Request Body:
```json
{
  "address": "New Address St.",
  "contactNumber":"+11111111"
}
```


**9. Retrieve Chefs**  
Description: Retrieves a list of all chefs by a client  
Endpoint: `clients/chefs`  
Method: GET  

**10. Add Dish to Client's Favorite Dishes**  
Description: Adds a dish to the list of favorite dishes of the client  
Endpoint: `/clients/me/favorite-dishes`  
Method: POST  
Request Body:
```json
{
  "dishId": "12345"
}
```

**11. Retrieve Client's Favorite Dishes**  
Description: Retrieves a list of favorite dishes of the client  
Endpoint: `/clients/me/favorite-dishes`  
Method: GET  

**12. Delete Dish from Client's Favorite Dishes**  
Description: Deletes a dish from the list of favorite dishes of the client  
Endpoint: `/clients/me/favorite-dishes/:id`  
Method: DELETE  
Parameters:
- `id` (required): The ID of the dish to remove from favorites  
Example URL: `/clients/me/favorite-dishes/12345`

**13. Retrieve Client's Order History**  
Description: Retrieves the order history of the client  
Endpoint: `/clients/me/order-history`  
Method: GET  

**14. Rate Dish NOT COMPLETED**  
Description: Allows a client to rate a certain dish  
Endpoint: `/clients/rating-dish/:id`  
Method: POST  
Parameters:  
- `id` (required): The ID of the dish to rate  
Example URL: `/clients/rating-dish/12345`  

**15. Get Chef's Dishes by Client**  
Description: Allows a client to retrieve a list of dishes offered by a specific chef  
Endpoint: `/clients/chefs/dishes/:id`  
Method: GET  
Parameters:  
- `id` (required): The ID of the chef to retrieve the dishes from  
Example URL: `/clients/chefs/dishes/12345`  

**16. Get Chef By Id**  
Description: Retrieves information about a specific chef by their ID  
Endpoint: `/clients/chefs/:id`  
Method: GET  
Parameters:  
- `id` (required): The ID of the chef to retrieve
Example URL: `/clients/chefs/12345`

**17. Create Chef Profile**  
Description: Allows a user to create a chef profile  
Endpoint: `/chef/`  
Method: POST  
Request Body:
```json
{
  
    "restaurant": "Example Restaurant",
    "location": "Istanbul",
    "openingHours": "9:00 AM",
    "closingHours": "6:30 PM",
    "contactNumber": "+19999999",
    "description": "Example description of cuisine"

}
```

**18. Edit Chef Profile**  
Description: Allows the chef to edit their profile information  
Endpoint: `/chef/me`  
Method: PUT  
Request Body:
```json
{
  "restaurant": "New Name",
  "location": "New location",
  "openingHours": "9:00 AM",
  "closingHours": "6:30 PM",
  "contactNumber": "+19999999",
  "description": "New description, new opening and closing hours or new contact number"
}
```

**19. Get Chef Profile**  
Description: Retrieves the profile of the chef  
Endpoint: `/chef/me`  
Method: GET  

**20. Create Dish**  
Description: Allows a chef to create a new dish and add it to their culinary offerings  
Endpoint: `/chef/dish`  
Method: POST  
Request Body:
```json
{
  
    "name": "New Dish",
    "description": "Ingredients, possible allergic matters",
    "price": "$25.99",
    "rating": ""

}
```
**21. Get All Dishes**  
Description: Retrieves all dishes offered by the chef  
Endpoint: `/chef/dish`  
Method: GET  

**22. Get Dish By Id**  
Description: Retrieves a specific dish by its ID  
Endpoint: `/chef/dish/:id`  
Method: GET  
Parameters:  
- `id` (required): The ID of the dish to retrieve  
Example URL: `/chef/dish/12345`

**23. Delete Dish By Id**  
Description: Deletes a specific dish by its ID  
Endpoint: `/chef/dish/:id`  
Method: DELETE  
Parameters:  
- `id` (required): The ID of the dish to delete  
Example URL: `/chef/dish/12345`

**24. Create Order**  
Description: Allows a client to create a new order   
Endpoint: `/orders`  
Method: POST  
Request Body:
```json
{
    "items": [
    {
      "dishId": "12345",
      "chefId": "67890",
    }
  ]
}
```  

**25. Client Cancel Order**  
Description: Allows a client to cancel an order they previously placed  
Endpoint: `/orders/cancel-order/:id`  
Method: DELETE  
Parameters:  
- `id` (required): The ID of the order to cancel  
Example URL: `/orders/cancel-order/12345`

**26. Get Chef Orders**  
Description: Allows a chef to retrieve a list of their orders  
Endpoint: `/orders/chef-orders`  
Method: GET  

**27. Chef Update Order Status**  
Description: Allows a chef to update the status of an order they are handling  
Endpoint: `/orders/chef-update-order-status`  
Method: PUT  
Request Body:  
```json
{
  "status": "delivered"
}
```

## API Documentation

We're all about making your journey into our API as smooth as possible. That's why we've set up Swagger – an interactive and user-friendly tool that lets you dive into our API endpoints with confidence. 

**Swagger URL:** [http://localhost:3000/api-docs/#/](http://localhost:3000/api-docs/#/)  

We understand that everyone has their own preferences. Swagger is here to guide you, but feel free to bring along your favorite tools like Postman if that's more your style. Our goal is to make your experience comfortable, so go ahead and explore in the way that suits you best.


## Contributing

Thank you for showing interest in contributing to Cookiz! If you're excited to join hands, please take a look at these straightforward guidelines:

**1. Fork and Branch:** Start by forking the repository and creating your branch from the main one.  
**2. Code Magic:** Make the magic happen! Feel free to make improvements, changes, or fixes to the codebase.  
**3. Style Harmony:** Keep the code in tune with the project's coding conventions and style guidelines.  
**4. Message Clarity:** Craft clear and concise commit messages that spell out the purpose of your changes.  
**5. Pull It Together:** When you're ready, send in a pull request to our main repository.  
**6. Review Time:** Our vigilant maintainers will review your pull request and provide any necessary feedback.  
**7. Merge and Shine:** Once any requested tweaks are addressed, your contribution will be merged into the main branch. Congratulations, you've joined the ranks of Cookiz contributors!  

We're thrilled to have you aboard and can't wait to see your contributions.
