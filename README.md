This project is AssessMent Project -

Create Backend Web API application that can cover following APIs
- api/Auth/Authenticate - This API will return access token if successful login based on email id, password and role of the user.
- api/Users - All CRUD operations for user table. All Get APIs should be developed using Dapper.
- Chathub - Hub class to perform global chatting.

Create frontend Application with following constraints
- auth/login - this page used for login purpose sending email id, passwrord and role type and once successful login will redirected to home page [org/home]
- org/home - this is main landing page of the application will be accessible only for logged in user
-- This screen will have following buttons in navigation bar
-- Users - This button will be visible to only for admin user. Navigation link = org/users
-- Profile - This is accessible to all users. Navigation link = org/profile.
-- Chat - This is accessible to all users. Popup will be opened for Chatting.
- org/users - Here all users will be visible from DB and user can perform CRUD operations on Users.
- org/profile - Here logged in user profile details will be shown.
- Chat popup - This is global chatting popup where users can send/receive live messages using SignalR.