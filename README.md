﻿# Artists Search API

## Overview

This project is Node.js application developed using Express.js made for the Incedo Services GmbH backend challenge. It uses Last.fm API's artist.search endpoint to search for artists by name. This server allows users to search for artists by name and download artists data in CSV format. It returns a random artist if the search result is empty.

## Getting Started

### Prerequisites

- Node.js 

### Installation

1. **Clone the Repository**

    ```
    git clone https://github.com/Malek-Ghorbel/artists-search-api
    cd  artists-search-api
    ```

2. **install dependencies**


    ```
    npm i
    ```

3. **add the environment file**

add `.env` file where you specify your api key and secret for the Last.fm api following the `.env example` (or simply fill your information there and remove `example`)

4. **run server**


    ```
    npm start
    ```

The server will be available on http://localhost:3000 (if you did not speicfy another port)

## Testing

This project's test suite is built using Jest. To run the tests, use the following command:
```
  npm run test
```

## Deployment

This application is deployed as a container using Azure App Service you can directly access it and test the endpoints on https://malekartistservice.azurewebsites.net 

## API Documentation


**Request**

- **Method:** GET
- **URL:** `/artist/search`
- **Request params:**
  - `artist` (string, required): The name of the artist you want to search for
  - `limit` (string, optional): The limit number of artists returned
  - `page` (string, optional): The page number 
- **Exemple:** 
    GET http://localhost:3000/artist/search?artist=Coldplay
- **Response**
  - return 200 as status code with the the artist data in the body if it was found else return a random one
  - return 400 error if the artist parameter was not specified

**Request**

- **Method:** GET
- **URL:** `/artist/download`
- **Request params:**
  - `artist` (string, required): The name of the artist you want to search for
  - `filename` (string, optional): The name of the CSV file that will be downloaded
  - `limit` (string, optional): The limit number of artists returned
  - `page` (string, optional): The page number 
- **Exemple:** 
    GET http://localhost:3000/artist/download?artist=Coldplay&filename=aa
- **Response**
  - return 200 as status code and download the csv file
  - return 400 error if the artist parameter was not specified
