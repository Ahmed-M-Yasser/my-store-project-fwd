# Additional Notes
- After the migration up, all the required tables will be created. In addition, 3 dummy products will be inserted to bootstrap the testing. You can off course create additional product(s) from the API.
- Instead of handlers, I used controllers.
- I used `uuid` for primary key instead of `serial` to avoid restarting the seed after deleting the records.

## API Endpoints
#### Products
- Index: Get All Products `api/products` [GET]
- Show: Get By Id `api/products/<product id>` [GET]
- Create [admin token required] `api/products` [POST]
    Request:
    {
        "product_name": "Product 4",
        "price": "150.00"
    }
    - I couldn't bring myself to allow the sales user to add product(s), so you need to register 1 Admin user & use their token to add new proucts. You will get validation message if you tried with Sales user.
    - There are other validations also like price must be positive numeric value & product name must be unique.

#### Users
- Create `api/users` [POST]
    Request:
    {
        "email": "user1@mail.com",
        "first_name": "fst",
        "last_name": "lst",
        "pwd": "P@ssw0rd",
        "user_role": "Admin"
    }
    - Accepted email format is `text@text.text`
    - Accepted pwd must be at least 8 characters & contains at least 1 special character, 1 capital letter, 1 small letter & 1 number
    - Allowed user_role values are `Admin` & `Sales`
    - The values that should be used for login API are `email` & `pwd`
- Login/Authenticate `api/users/authenticate` [POST]
    Request:
    {
        "email": "user1@mail.com",
        "password": "P@ssw0rd"
    }
    - Kindly note that `email` & `pwd` are used to authenticate the user, NOT `first_name` & `last_name`!!
- Index: Get All -Sales- Users [admin token required] `api/users` [GET]
    - I thought it's a bad idea to allow the sales user to see all registered users, so this endpoint need to be accessed using Admin user. You will also see all Sales users. This can be further expanded in the future to add SuperAdmin user who can see all Admin users [Not implemented]
- Show: Get By Id [token required] `api/users/<user id>` [GET]
    - You can only check your own user details. If you provided another user id, you will get validation message
    - This user id can be obtained from login API response
- Update [token required] `api/users` [PATCH]
    Request:
    {
        "id": "025a8530-c1b9-44c6-a0b0-6f32b8f4e8c1",
        "email": "user1@mail.com",
        "first_name": "fst 1",
        "last_name": "lst 1",
        "pwd": "P@ssw0rd"
    }
    - You can only update your own user details. If you provided another user id, you will get validation message
    - Please note that user_role doesn't exist in the request so that no Sales user can be converted to Admin user nor vice versa
- Delete [token required] `api/users/<user id>` [DELETE]
    - You can only delete your own user details. If you provided another user id, you will get validation message

#### Orders
- Create [token required] `api/orders` [POST]
    Request:
    [
        {
            "product_id": "c2299c82-e65a-478a-8fee-24fa9b49109e",
            "qty": 2
        },
        {
            "product_id": "3fa60f7a-8fd4-4672-81f5-715e38c76d8d",
            "qty": 3
        }
    ]
- Index: Get All Orders by the current/logged in user [token required] `api/orders` [GET]
    - You can only view orders placed by your own user, otherwise, you will get validation message.
- Show: Get By Id [token required] `api/orders/<order id>` [GET]
    - You can only view an order that's placed by your own user, otherwise, you will get validation message.
- Update Order Status [admin token required] `api/orders/<order id>/<status>` [PATCH]
    - You need to login with Admin user to update the order status.
    - When orders are placed by the Sales user, the status will be `Active`. I think of it as initiated.
    - Allowed values for status are `Confirmed` & `Rejected`.

## Data Shapes
#### products
- id [uuid]
- product_name [varchar(255)]
- price [decimal]

#### users
- id [uuid]
- email [varchar(50)]
- first_name [varchar(50)]
- last_name [varchar(50)]
- pwd [varchar(255)]
- user_role [varchar(50)]

#### orders
- id [uuid]
- total [decimal]
- order_date [TIMESTAMP]
- user_id [uuid]
- order_status [varchar(10)]

#### order_products
- id [uuid]
- order_id [uuid]
- product_id [uuid]
- qty [decimal]
- price [decimal]
    - I added this table because there's a many-to-many relation between orders & products
    - Based on the qty & price here, the orders.total is calculated
    - I added price here because we cannot depened on the products.price since it can be changed in the future