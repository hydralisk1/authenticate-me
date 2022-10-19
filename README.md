# Meetup Clone

## DB Schema
![DB Schema](./assets/db.png)

## API Documentation

### Add User
* Require Authentication: false
* Request
  * Method: POST
  * URL: /api/users
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "name": "user name",
    "email": "user email",
    "password": "user password",
    "location": "user location",
    "age": "user age",
  }
  ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Successfully created",
      "statusCode": 201
    }
    ```

### Create a Group
* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/groups
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "name": "group name",
    "description": "description",
    "location": "group location",
    "public": "boolean value. true means public, false means private",
    "organizedBy": "user id creating this group",
  }
  ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Successfully created",
      "statusCode": 201
    }
    ```

### Create an Event
* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/events
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
  {
    "title": "event title",
    "description": "description",
    "online": "boolean value. true means online event. false means offline event",
    "time": "datetime",
    "address": "address",
  }
  ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Successfully created",
      "statusCode": 201
    }
    ```
