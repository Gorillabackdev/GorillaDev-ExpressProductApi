# Product CRUD API

A lightweight RESTful API built with Node.js and Express for managing products. This project demonstrates fundamental CRUD operations (Create, Read, Update, Delete) and includes a custom integration test runner built without external testing libraries.

## Features

- **RESTful Architecture**: Standard HTTP methods for resource management.
- **Express.js**: Fast, unopinionated web framework.
- **Custom Test Runner**: Integration tests written using Node.js's native `http` module (no Axios/Jest required).
- **MongoDB Storage**: Products and external todo responses are persisted in MongoDB.

## Prerequisites

- Node.js (v14 or higher recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/product-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd product-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with:
   ```env
   store your secret keys add it to gitignore

## Usage

### 1. Start the Server
You can start the server in production mode or development mode (using nodemon).

```bash
# Standard start
npm start

# Development mode (auto-restarts on save)
npm run dev
```
The server will start on `http://localhost:3000`.

Cloudinary is configured at startup using the environment variables above.

### 2. Run Tests
This project includes a custom script to verify API functionality. **Ensure the server is running in a separate terminal window before running tests.**

```bash
node test_crud.js
```

## API Endpoints

| Method | Endpoint | Description | Body Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Get all products | No |
| `GET` | `/products/:id` | Get a single product | No |
| `GET` | `/external/todos/1` | Fetch external todo, map it, save it, and return saved record | No |
| `POST` | `/products` | Create a new product (uploads image to Cloudinary if provided) | `multipart/form-data` with `name`, `price`, optional `description`, optional file `image` |
| `PUT` | `/products/:id` | Update a product | `{ "price": 15.0 }` |
| `DELETE` | `/products/:id` | Delete a product | No |

When `image` is sent in `POST /products`, the API uploads it to Cloudinary and saves the returned URL in `ImageUrl`.
Each successful call to `GET /external/todos/1` saves a mapped copy of `https://jsonplaceholder.typicode.com/todos/1` in MongoDB and returns the saved document.

## License
ISC
