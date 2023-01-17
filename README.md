# Storefront Backend Project

## Getting Started

I made this API from the enduser point of view. Which means that they can register new user, view product(s) & place order(s). Since you also spcified that you need APIs for create product, view all users, change order status, I added `role` logic. You can either login as `Admin` or `Sales` user & perform the actions suitable to your role. You can find more details in `REQUIREMENTS.md`.
Kindly refer to the requests at `REQUIREMENTS.md` for your testing.

## Setup
All required details exist in `.env` file, but here is the summary:
- The API runs on port [3000] `localhost:3000`
- The database runs on port [5000] --feel free to change it to [5432] --This was already mentioned in the previous submission.
- I'm not using GIT. That's why I didn't include .gitignore in the previous submission. I added it now.
- Create the dev database `CREATE DATABASE my_store_dev`
- Create the test database `CREATE DATABASE my_store_test`
- Use `npm run build` to Build the files
- Use `npm run start` to Start the project
- Use `npm run test` to check the unit testing on Windows
- Use `npm run test:mac` to check the unit testing on Mac
- Use `npm run format` to use prettier
- Use `npm run lint` to use eslint
- Use `npm run migration:up` to migrate up
- Use `npm run migration:reset` to reset the migration
- Run `npm install` on the root directoy to install all the dependencies

## Note to the reviewer

All CRUD operations & more exist within the different modules. For example, Creat, Read, Update & Delete exist within `user.model.ts`
I believe the purpose of this project is to show my understanding of the lessons & how to implement them. Having said that, I'm sorry to say that I didn't add for example delete/update product, delete order as it's a redundant work & I'm already late in delivering the project & have tight schedule. I also didn't see such APIs mentioned in the rubric nor in `REQUIREMENTS.md`.
PS: I know when deleting a product, we need to check if it exists in any order or not first due to the foreign key constraint.