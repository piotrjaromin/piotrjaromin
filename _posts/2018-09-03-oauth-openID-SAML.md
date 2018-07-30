---
layout: post
title:  oauth2 and openID Connect
date:   2017-08-19 17:03:06 +0200
categories: IAM authorization authentication security
tags: IAM authorization authentication security
---

Overview of each

## OAuth2

It is about authorization (e.g granting access to resource), it operates on tokens and allows for third parties to access resources which belong to another user (of course he agreed beforehand). User in this case is called "Resource owner". Tokens which are issued usually can be invalidated at any time, they also contain list of scopes (actions) which can be performed by entity using token. For oauth2 to work you need to create set of credentials (which are called client or application) which are usually called `client_secret` and `client_id` or similarly, those credentials are used by oauth2 provider to distinguish between different third parties. You can see example of this functionality when you click login with facebook/google/etc.

It can be simplified to:

1. User goes to third party page and clicks login with facebook
2. New window appears, it is directly taken from facebook servers, facebook recognizes which third party is trying to gain access for user because `client_id` was sent.
3. Users logins and authorizers third party page to access his/her resources
4. Windows closes and third party page now have access token which allows to make calls to facebook on behalf of user


There are 4 grant flows of obtaining token

### Client credentials

1. applications uses its own `client_secret` and `client_id` to obtain token

Usually used when there is no need for user scoped tokens, like for public resources, or resources which are directly associated with application

### Resource owner

1. user opens application
2. user provides credentials(username/password) directly in third party application
3. application sends those credentials to oauth2 server and obtains token

Not recommended should be used only in application that are fully trusted by user.

### Authorization code grant

1. user opens application
2. application redirects user to oauth2 server login page
3. oauth2 server redirects user back to original application with authorization code in url fragment
4. application makes request to oauth2 server with authorization code along with its credentials (`client_secret`/`client_id`)
5. oauth2 server validates that code belongs to given application credentials and returns access token

Most recommended type, usually safest for user and application. Requires more work than the rest of flows.

### Implicit grant

1. user opens application
2. application redirects user to oauth2 server login page
3. user enters credentials and logins
4. oauth2 server redirects user back to original application with access token in url fragment

Can be used by public clients, simple to implement, usually not recommended.

## openID connect

Is about identity; in oauth2 we were speaking about "what I can do", in openID Connect we are talking about "who am I". Those identities are provided by identity provider, and are not only related to humans, objects and services also can have ones.

OpenID Connect gives you token (e.g jwt) but this time this token authenticates person, instead of list of allowed actions(scopes) like in oauth2.
