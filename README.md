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

## Future Features

Future enhancements include:

* Frontend client application
* Access control features
* Administrative groups
* Ability to "react" to messages


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

Each item in the Collection is described in detail below.

## Server
The Server acts as the top-level structure. A Server contains Channels which contain Messages. In a future revision, the Servers will be queryable from the list of Servers to which the current user has access.

#### Create Server

**Format**

Type: POST
Required:
* {{apiId}} - Global
* {{authToken}} - Global

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/server
```

**Body**

Required:
* name: The server's name

```
{
	"name": "Default Server"
}
```

**Response**

201 Created. Returns a newly created Server in the following format:

```
{
    "item": {
        "serverId": "16308aed-a580-42e8-9f40-fea600a0d536",
        "name": "Default Server"
    }
}
```

## Channels

#### Get All Channels in Server

**Format**

Type: GET
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{serverId}} - The serverId returned in the Create Server call

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/server/{{serverId}}
```

**Body**

None

**Response**

Returns a list of all Channels within the Server in the following format:

```

```

#### Create Channel in Server

**Format**

Type: POST
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{serverId}} - The serverId returned in the "Create Server" call

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/server/{{serverId}}
```

**Body**

Required:
* name: The channel's name

Optional:
* description: The channel's description

```
{
	"name": "General Chat",
    "description": "Channel for open discussion"
}
```

**Response**

Returns a newly created Channel in the following format:

```
{
    "item": {
        "serverId": "16308aed-a580-42e8-9f40-fea600a0d536",
        "channelId": "5b291967-326e-4628-837c-ec774b2e6654",
        "createdBy": "HZq3VRYPEVGHvJUncCC3XkeQ6wThVtgr@clients",
        "createdAt": "2021-06-07T00:52:13.367Z",
        "name": "General Chat",
        "description": "Channel for open discussion"
    }
}
```

## Messages

#### Get All Messages in Channel

**Format**

Type: GET
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{channelId}} - The channelId returned in the "Create Channel in Server" or "Get All Channels in Server" calls

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/channel/{{channelId}}
```

**Body**

None

**Response**

Returns the Messages stored within the Channel in the following format:

```

```

#### Create Message in Server

**Format**

Type: POST
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{channelId}} - The channelId returned in the "Create Channel in Server" or "Get All Channels in Server" calls

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/channel/{{channelId}}
```

**Body**

Required:
* message: The message to post to the channel

```
{
	"message": "Hello, World!"
}
```

**Response**

Returns a newly created Message in the following format:

```

```

#### Update Message in Server

**Format**

Type: PATCH
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{channelId}} - The channelId returned in the "Create Channel in Server" or "Get All Channels in Server" calls
* {{messageId}} - The messageId of the message to update

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/channel/{{channelId}}/{{messageId}}
```

**Body**

Required:
* message: The message to update on the channel

```
{
	"message": "Hello, World!"
}
```

**Response**

Nothing returned in JSON format.

#### Delete Message in Server

**Format**

Type: DELETE
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{channelId}} - The channelId returned in the "Create Channel in Server" or "Get All Channels in Server" calls
* {{messageId}} - The messageId of the message to delete

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/channel/{{channelId}}/{{messageId}}
```

**Body**

None

**Response**

Nothing returned in JSON format.


#### Get Signed URL for Uploading an Image

**Format**

Type: POST
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{channelId}} - The channelId returned in the Create Channel in Server or Get All Channels in Server calls
* {{messageId}} - The messageId of the message to update with the image attachment

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/channel/{{channelId}}/{{messageId}}/attachment
```

**Body**

None


**Response**

Returns the Signed URL in the following format:

```

```


#### Upload Image to Message

**Format**

Type: PUT
*Note* Authentication must be disabled - the Signed URL provides its own signature.

Use the URL retrieved via "Get Signed URL for Uploading an Image."


**Body**

None


**Response**

Returns the S3 URL in the following format:

```

```


#### Upload Image to Message

**Format**

Type: Get
*Note* Authentication should be disabled - the Signed URL provides its own signature.

Use the URL retrieved via "Upload Image to Message."

**Body**

None

**Response**

The image from S3.

## User ##

These functions are intended to allow users to save a nickname for display in that chat. If no nickname is provided, the userId is returned.

#### Get User Nickname

**Format**

Type: GET
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{userId}} - The userId of the authenticated user

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/user/{{userId}}
```

**Body**

None

**Response**

The user's nickname for use within the application in the following format.

```
{
    "nickname": "CodeMonkey"
}
```

#### Set User Nickname
Note: This can be used for both the initial setting of the nickname or the update of an established one.

**Format**

Type: POST
Required:
* {{apiId}} - Global
* {{authToken}} - Global
* {{userId}} - The userId of the authenticated user

```
https://{{apiId}}.execute-api.us-east-2.amazonaws.com/dev/user/{{userId}}
```

**Body**

Required:
* nickname: The channel's name

```
{
	"nickname": "CodeMonkey"
}
```

**Response**

Returns the user's data in the following format:

```
{
    "item": {
        "userId": "HZq3VRYPEVGHvJUncCC3XkeQ6wThVtgr@clients",
        "nickname": "CodeMonkey"
    }
}
```