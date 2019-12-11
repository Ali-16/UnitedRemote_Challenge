# CataShops

Web Applcation where you can found listing of shops near to your place!

- You can sign in & sign up using your email & password.
- You can display the list of shops sorted by distance
- You can like a shop, so it can be added to your preferred shops
- NB: liked shops shouldn’t be displayed on the main page
- You can dislike a shop, so it won’t be displayed within “Nearby Shops” list during the next 2 hours
- You can display the list of preferred shops
- You can remove a shop from your preferred shops list


### Prerequisites

 - [Node.js ^10.9.0](https://nodejs.org/en/)
 - [angular CLI ^8.3.5](https://cli.angular.io/)
 - [PHP ^7.2](https://www.php.net/manual/en/install.php)
 - [Composer ^1.9.0](https://getcomposer.org/download/)
 - [MongoDB ^4.2.0](https://www.mongodb.com/)
 - [MongoDB PHP driver](https://docs.mongodb.com/ecosystem/drivers/php/)


## Built With

  * [Laravel](http://www.laravel.com) - The backend framework
  * [Angular](http://www.angular.io) - The frontend framework
  * [Composer](https://maven.apache.org/) - Dependency manager for laravel
  * [npm](https://maven.apache.org/) - Dependency manager for angular
  * [mongoDB](https://mongodb) - No SQL Database Management system

- Packages
  * [Laravel mongoDB](https://maven.apache.org/)
  * [Laravel jwt](https://maven.apache.org/)
  * [Laravel CORS](https://maven.apache.org/)
  * [moment.Js](https://maven.apache.org/)
  * [ng Infinite Scroll](https://maven.apache.org/)


### Installing & gettinhg started


Create a new folder at your local machine, and turn it to a Git repository using the CLI git command.
```
$ git init
```

Clone the present repository into your repository

```
$ git clone https://github.com/Ali-16/UnitedRemote_Challenge.git
```

After installing [MongoDB](https://www.mongodb.com/), create a mondoDB database, then import into it the documents written in the bson file, present in data folder.<br/> 
`NB: the collection name should be shops`

```
$ mongorestore -d db_name -c shops /path/data/shops.bson
```

Create a new file `.env` and fill it up with the content of the file `.env.example`. Then, change the database-related informations, in the `.env` file, you can take the `.env.example` for an example... .

```
DB_CONNECTION=mongodb
DB_HOST=localhost
DB_PORT=27017
DB_DATABASE=DATABASE_NAME
DB_USERNAME=DATABASE_USERNAME
DB_PASSWORD=DATABASE_PASSWORD
```

Get into the new backend folder, then install the required composer dependencies, for laravel application

```
$ cd backend
$ composer update
```

Generate a secret key for laravel encoding stuff.

```
$ php artisan key:generate
```

Run migrations, to create users collections and create new location-related index for shops collection, by runing bellow CLI command from the backend folder

```
$ php artisan migrate
```

Publish Jessengers (jwt) config file, then generate a secret key for JWT encoding tokens..

```
$ php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
$ php artisan jwt:secret
```



Get into frontend folder, then install the required npm dependencies, for Angular application

```
$ cd ../frontend
$ npm install
```

Use PHP's built-in development server to serve the application backend.

```
$ php artisan serve
```

use Node and angular CLI to serve the application frontEnd. Once compiled, You can access it at http://localhost:4200/

```
$ ng serve
```


## How it works


* **Backend**
The laravel application offers an API which permit to register/authenticate a user & do actions relative to shops data.<br/>
It uses **J**avaScript **W**eb **T**oken system for authentication, and is connected to a **N**ot **O**nly **SQL** database MongoDB.

To perform these actions, the application uses principally a ShopController, AuthController and api-routes.

* **Frontend** :<br/>
The angular application was designed around 4 main features :
1. Header (with a navbar) & static Footer.
2. Authentication features
3. shops-related features
4. token-related features

**Authentication feature :**<br/>
_Auth component_ defines common part between two childrens _signin component_ & _signup component_, which are responsible of the rendering of forms & lanfing pages. 
_Auth-service_, sends requests to backend api to register or authenticate a user.

**shops-related features :** <br/>
_Shop-list component_ represents the main component of the applications, is responsible of the rendering of a list of child component: _shop-item_.
It recieves shops-data from the _shops-service_, which sends Http requests to backend API and handles Http responses from it. 
The _shop-item component_ recieves relevant shop informations, (name, pictures, type of rendering), from _shops-list component_ using _@Input_ directive. In the other hand, the _shop-item_ can emit events whom are listened to by the shops-list component (like/dislikes...) using _@output_ directive.

**token-related features:**<br/>
_Token-Service_  sends http shops-related requests to backend Api to refresh tokens, set/get token recieved from backend at/from the user browser local storage, manages lifecycle of a given token.
_Token-interceptor_ which is a layer between frontend and backend, it intercepts data-related http requests/responses, inject a valid token in the requests intercepted and handle relative error response of it.


The app-root component calls the header, the footer and the router-outlet, which decides to call either the auth-component or the shops-list component.


## Authors

* **Ali Sidibaba** - *Initial work* - 

* Applicatoin logo realized by awesome colleague **Nabil Rochd** [Github-Portfolio](https://google.com)
