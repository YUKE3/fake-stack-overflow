A simple mimic of the Stack Overflow Website.

Full stack web application using the MERN stack.

Read the Project Specfications [here](https://docs.google.com/document/d/1zZjNk9cbNLz0mp_-YtyZxhMzUph97fVgCkSE4u2k5EA/edit?usp=sharing).

![Class diagram](https://github.com/CSE-316-Software-Development/final-project-YUKE3/blob/main/images/class%20diagram.jpg?raw=true)

## Instructions to setup and run project

Running the server: 

    cd ./server
    npm install
    node server.js

Running the server requires setting a secret in .env
It should already in the repo, but the .env should include

    SECRET={whatever secret}

Running the server also require a mongoDB database server on mongodb://localhost:27017/fake_so

A barebones populateDatabase script is provided, it will drop the current fake_so database and add some users.

    cd ./server
    node populateDatabase.js
    
Testing user login emails:

    highrep@me
    lowrep@me
    manything@me
    root@me
    
All passwords are:

    password
    
Running the client:

    cd ./client
    npm install
    npm start

## Design Patterns

The Builder design pattern is used for Question, Tags, Answers, and Users.
This design pattern is used because these objects have multiple parameters in their creation, which may or may not be optional. Using the builder design pattern, I can specify what is required, as well as provide a better label for the parameters for ease of reading the code.

The builders are inside the builders folder in server.
