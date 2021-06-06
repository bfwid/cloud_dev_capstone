# Udacity Cloud Developer Capstone

## Capstone Project

This application was written for the Udacity Cloud Developer Capstone project (Option 2 - Serverless) leveraging lesson material and Udacity's Cloud Developer Project 4 as a starting point.

[https://github.com/bfwid/cloud_dev_capstone](https://github.com/bfwid/cloud_dev_capstone) - Provided for Grading

[Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990)

## The Application

This application acts as simple chat program, intended for simple communication between multiple parties. This was inspired by my use of Discord to stay connected during the pandemic quarantine.

## Current Features

The chat application allows users to communicate in different channels created within a parent server. Within a channel, a user can submit a message; the message will be logged with the user's name and the timestamp at which the message was created. A function exists to set an application-wide nickname for the user. Images can also be shared. Authentication will be required to communicate or review messages.

* Login
* Create/Edit Nickname
* Create Server
* View all Channels within a Server
* Create Channel
* View Messages by Channel
* Add Message to Channel
* Modify User's Messages (Cannot modify another user's messages)
* Delete User's Messages (Cannot delete another user's messages)
* Add Image to Message


## Behind the Scenes

This application is a simple Serverless application, which uses Amazon Web Services (AWS) to host various resources including Lambda functions, DynamoDB tables and index, and API Gateway to support application functionality. As this course did not focus on frontend development, this was not the focus of this project; rather, instructions follow to use the Postman collection provided for these functions.

Authentication uses the [Auth0](https://auth0.com/).


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

# Postman Collection

A Postman collection is provided for testing and debugging. Before beginning, ensure that the Collection's variables are populated. These should have been submitted with the project on Udacity.

* apiId: The endpoint necessary to interact with the functionality
* authToken: A token for authorization

## Server ##

TODO

## Channels ##

TODO

## Messages ##

TODO

## User ##

TODO