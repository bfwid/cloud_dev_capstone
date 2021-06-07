# Udacity Cloud Developer Capstone

## Capstone Project

This application was written for the Udacity Cloud Developer Capstone project (Option 2 - Serverless) leveraging lesson material and Udacity's Cloud Developer Project 4 as a starting point.

[https://github.com/bfwid/cloud_dev_capstone](https://github.com/bfwid/cloud_dev_capstone) - Provided for Grading

[Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990)

## The Application

This application acts as simple chat program, intended for simple communication between multiple parties. This was inspired by my use of Discord to stay connected during the pandemic quarantine.

## Current Features

The chat application allows users to communicate in different channels created within a parent server. Within a channel, a user can submit a message; the message will be logged with the user's name and the timestamp at which the message was created. A function exists to set an application-wide nickname for the user. Images can also be shared. Authentication will be required to communicate or review messages.

* Authentication
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
* Pagination of messages
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

### Create Server

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
Channels exist within a Server and contain Messages.

### Get All Channels in Server

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

200 OK. Returns a list of all Channels within the Server in the following format:

```
{
    "items": [
        {
            "serverId": "16308aed-a580-42e8-9f40-fea600a0d536",
            "createdAt": "2021-06-07T00:52:13.367Z",
            "channelId": "5b291967-326e-4628-837c-ec774b2e6654",
            "description": "Channel for open discussion",
            "name": "General Chat",
            "createdBy": "HZq3VRYPEVGHvJUncCC3XkeQ6wThVtgr@clients"
        },
        {
            "serverId": "16308aed-a580-42e8-9f40-fea600a0d536",
            "createdAt": "2021-06-07T00:53:26.887Z",
            "channelId": "fa88ed12-ff25-4d86-87e0-45e70783d3e1",
            "description": "For chatting about software development",
            "name": "Developer Discussion",
            "createdBy": "HZq3VRYPEVGHvJUncCC3XkeQ6wThVtgr@clients"
        }
    ]
}
```

### Create Channel in Server

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

201 Created. Returns a newly created Channel in the following format:

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
Messages are housed in Channels and contain user-input messages to share with other authenticated users. Messages can be modified and deleted, but only by the user who created them. A future revision will allow administrative users to remove unwanted messages. Messages may also contain images. They are stored in chronological order. Another future revision will include pagination.

### Get All Messages in Channel

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

200 OK. Returns the Messages stored within the Channel in the following format:

```
{
    "items": [
        {
            "createdAt": "2021-06-07T00:55:12.154Z",
            "message": "Hello, World!",
            "channelId": "5b291967-326e-4628-837c-ec774b2e6654",
            "messageId": "e0de68e7-0a27-4eac-aff7-05554f6f1136",
            "createdBy": "HZq3VRYPEVGHvJUncCC3XkeQ6wThVtgr@clients"
        },
        {
            "createdAt": "2021-06-07T00:56:54.752Z",
            "message": "Hey!",
            "channelId": "5b291967-326e-4628-837c-ec774b2e6654",
            "messageId": "985e69e5-e98f-4480-a365-0f986871f733",
            "createdBy": "HZq3VRYPEVGHvJUncCC3XkeQ6wThVtgr@clients"
        },
        {
            "createdAt": "2021-06-07T00:57:06.554Z",
            "message": "How are you?",
            "channelId": "5b291967-326e-4628-837c-ec774b2e6654",
            "messageId": "cebdd7db-b695-4ac5-926b-bcc191e69a9b",
            "createdBy": "HZq3VRYPEVGHvJUncCC3XkeQ6wThVtgr@clients"
        }
    ]
}
```

### Create Message in Server

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

201 Created. Returns a newly created Message in the following format:

```
{
    "item": {
        "channelId": "5b291967-326e-4628-837c-ec774b2e6654",
        "messageId": "e0de68e7-0a27-4eac-aff7-05554f6f1136",
        "createdBy": "HZq3VRYPEVGHvJUncCC3XkeQ6wThVtgr@clients",
        "createdAt": "2021-06-07T00:55:12.154Z",
        "message": "Hello, World!"
    }
}
```

### Update Message in Server

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
	"message": "Hello, friends!"
}
```

**Response**

200 OK.

```
{}
```

### Delete Message in Server

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

204 No Content.


### Get Signed URL for Uploading an Image

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
{
    "uploadUrl": "https://image-bucket-bfwid-dev.s3.us-east-2.amazonaws.com/e0de68e7-0a27-4eac-aff7-05554f6f1136.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXFP6BRQWLS4FOLL7%2F20210607%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20210607T010227Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJHMEUCIQClOh7sJ8n4c5FzLied%2FKdiM2%2FxNFBCRHmPOEvKgTlSXwIgdjXGXmZp9m%2FN3Www%2BRzWzTT2Wh73pA9BqHYjve8m%2B%2FcqqgIIUhAAGgw0OTI4NDM0MDQzMzIiDKz2gdDnbjxbGok3DCqHArgutN7PP8x%2B1irr70Esrr8lGSV3lxJHi4KFDl5%2FAFA2bdtfcw1RJKWHo%2F6E%2Bh%2BovxgHmeKvyVMdcYApQ%2B%2FUDp5yZ6DEepukN2NCGubIhZnaCFruEX9ej8u8VptriT%2FYfAqyAepbAcurL%2BePi%2Bd4iBpOXipK%2B3yyDq8VGcN%2B%2FSIibqfRWULWbx5HCd31KE%2Fke3ZewiWmBjCmlUWWP%2FyRoIuitLCgWudw0dFKLh10rfO7bx4OeuMjN0xb7Cv2uRMK79yLnqyF7xrmDRNOxznxJAWlw0v1VcvjSieMBxAx1Xm%2FB2lcJXT2yuC3oIGE5nv9EZFJwFf6SpTaMMXgUp%2FRKZCZO0vxE5f7MKLg9YUGOpoB5ZNY%2FbFEjVGOtvq%2BTFtI5O63fBBSmFSLoVqGSa10lcfC6Ss0rF2RqwPLZD8ovNO32VdORVQukYNJmpNTF4cW4eosfUvkl2BIHv4yOdy%2FLW9%2Be0IQ7hLtGQXDA3WDFf%2B17lqmkVEbLPRmx5aYvACnCVZJtvv4qPn8yDiPdqxrn6nYNcByov31JKHlUnVsMCyyECD3I6ghrVeE2w%3D%3D&X-Amz-Signature=fb300d763b785a8987c634a7f7bf2a333a6b82e3ea690859b023178a767f34e4&X-Amz-SignedHeaders=host"
}
```


### Upload Image to Message

**Format**

Type: PUT
*Note* Authentication must be disabled - the Signed URL provides its own signature.

Use the "uploadUrl" retrieved via "Get Signed URL for Uploading an Image."


**Body**

Select an image from your machine to upload.


**Response**

200 OK.


### Upload Image to Message

**Format**

Type: GET
*Note* Authentication should be disabled - the Signed URL provides its own signature.

Return to "Get All Messages in Channel" to locate an "attachmentURL".

**Body**

None

**Response**

The image from S3.


## User

These functions are intended to allow users to save a nickname for display in that chat. If no nickname is provided, the userId is returned.

### Get User Nickname

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

### Set User Nickname
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
* nickname: The users's nickname

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