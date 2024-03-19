# CSV Upload PostgreSQL API

This API provides a seamless solution for uploading CSV files, parsing the data, and storing it in a PostgreSQL database. I

## Features

- **CSV Upload**: Easily upload CSV files through a simple API endpoint.
- **Data Parsing**: Parse CSV data and convert it into structured JSON format for database storage.
- **PostgreSQL Integration**: Store parsed CSV data directly into a PostgreSQL database for efficient data management.
- **Data Analysis**: Perform various data analysis operations such as age distribution calculation, and more.

## Configuration

To configure the API, create a `.env` file in the root directory of the project and add the following environment variables:

```dotenv
PORT
DB_USER
DB_HOST
DB_NAME
DB_PASSWORD
DB_PORT
FILE_PATH
