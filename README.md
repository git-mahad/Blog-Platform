# Blog Platform
## Project Structure:
- Built using NestJS framework
- Uses TypeORM for database operations with MySQL
- Follows a modular architecture with separate modules for posts and comments
- Uses DTOs (Data Transfer Objects) for request validation

## Main Features:
- Blog post management system with CRUD operations
- Pagination support for post listings
- Filtering posts by published status
- Search posts by author
- Search posts by tags

## API Endpoints (/posts):
- POST / - Create a new post
- GET / - List all posts with pagination
- GET /author/:author - Find posts by author
- GET /tag/:tag - Find posts by tag
- GET /slug/:slug - Find post by slug
- GET /:id - Get a specific post
- PATCH /:id - Update a post
- DELETE /:id - Delete a post

## Technical Features:
- Input validation using class-validator
- Global validation pipe with whitelist and transform options
- CORS enabled for frontend integration
- MySQL database integration
- TypeORM for database operations
- Error handling for not found cases
- CORS protection
- DTO validation

## Database:
- MySQL database
- TypeORM for ORM
- Automatic schema synchronization

## Clone the Project

``` bash
$ git clone [https://github.com/git-mahad/Blog-Platform.git](https://github.com/git-mahad/Blog-Platform.git)
```
## Navigate into Project Folder
``` bash
$ cd Blog-Platform
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Stay in touch

- Author - [M Mahad](https://www.linkedin.com/in/mahad-dev)

