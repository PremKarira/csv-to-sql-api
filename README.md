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

```

## Walkthrough
* Upload CSV
    - User can directly upload CSV
    - If not provided, CSV from filepath in env will be used

    <p align="center"><img src="https://github.com/PremKarira/csv-to-sql-api/blob/main/images/upload.png?raw=true"></p><br>
 
* Results
    - Shows nested json data from the first row of csv
    - Also show corresponding values for SQL insert query 
    - Age distribution is also reported below them.
    <p align="center"><img src="https://github.com/PremKarira/csv-to-sql-api/blob/main/images/result.png?raw=true"></p><br>