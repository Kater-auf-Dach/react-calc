# React Calculator
The simple calculator with storage history of operations at a server via API.
This project use:
  - React
  - NodeJS + ExpressJS
  - MongoDB + Mongoose

### Installation

React-calc requires NodeJS v7+ to run.
Install the dependencies and devDependencies and start the server.

```sh
$ cd react-calc
$ yarn
```
or (if you prefer NPM):
```sh
$ npm i
```
If you havn't installed MongoDB, install it as a service. Follow these instructions: [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)


Then run webpack-dev-server and node server:
```sh
$ npm start
$ node server/server
```
These ports is _:8080_ and _:3000_ by default. For resolving cross-domain requests, Webpack server is proxing API. Change Webpack config to set another ports.
Navigate to your webpack-server address in your preferred browser:
```sh
127.0.0.1:8080
```

### Building

```sh
$ npm run build
```

Verify the deployment by runing server and navigating to _127.0.0.1:3000_.
```sh
$ node server/server
```

API reference:

 - `GET  to '/api/memory'` - return all memory notes.
 - `POST to '/api/memory'` - added memory note.
 - `GET  to '/api/memory/latest'`  - return last notes. Count of notes may be set in query: last=(count). By default it's set 3. 
 - `GET  to '/api/memory/:id'` - return note by id.
 - `POST to '/api/memory/:id'` - delete note with such id.


License
----

MIT