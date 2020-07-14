# Many-Users-Crud

Many-Users-crud is an API, it was developed for the purpose of study,
done with Node JS, Express and Microsoft SQL SERVER (Sequelize) on Back-End

Features:
  - jwt authentication;
  - Create multiples users;
  - Delete a user;
  - Edit a user;
  - Show all users;
  - Show a specific user.

### Installation

Install the dependencies and devDependencies and start the server.

```sh
$ cd many-users-crud
$ yarn
```

### Start Dev server
```sh
$ yarn dev
```

### Generate first User and run migrations
```sh
$ yarn sequelize-cli db:migrate
$ yarn sequelize-cli db:seed:all
$ user: admin@teste.com | password: 123456
```

### Configuration
#### Docker
```sh
    if you want to use Docker, install the image by:
    docker pull microsoft.com/mssql/server:2019-CU3-ubuntu-18.04

    docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=yourStrong(!)Passw0rd" -p 1433:1433 --name sql1 -d mcr.microsoft.com/mssql/server:2019-CU3-ubuntu-18.04

    docker start sql1
```

### Host config:
```sh
Server port is :3333, defined on:
 |many-users-crud
       |--- src
        |--- server.js


Configure your database host in:
    |many-users-crud
       |--- src
        |--- config
          |--- database.js
````

### Routes
#### GET
```
[1] - /users?name=filter_by_name&email=filter_by_email
  return all users, when there are some of the filters, make a %like query
  on database;

  response example:

    [
      {
        "id": 1,
        "email": "testeuser@hotmail.com",
        "name": "tester",
        "createdAt": "2020-07-13T22:42:54.629Z",
        "updatedAt": "2020-07-14T03:27:51.431Z",
        "addresses": [
            {
                "id": 1,
                "zipCode": "84015200",
                "city": "Ponta Grossa",
                "state": "PR",
                "street": "av ernani batista rosas 251",
                "number": 251,
                "complement": "a complement",
                "createdAt": "2020-07-14T03:27:51.396Z",
                "updatedAt": "2020-07-14T03:27:51.396Z",
                "userId": 1
            }
        ],
        "phones": [
            {
                "id": 1,
                "phone": "991239508",
                "createdAt": "2020-07-13T22:42:54.725Z",
                "updatedAt": "2020-07-13T22:42:54.725Z",
                "userId": 1
            }
        ]
      },
      {
        "id": 2,
        "email": "testeusertwo@hotmail.com",
        "name": "testertwo",
        "createdAt": "2020-07-13T22:42:54.629Z",
        "updatedAt": "2020-07-14T03:27:51.431Z",
        "addresses": [
            {
                "id": 2,
                "zipCode": "84015200",
                "city": "Ponta Grossa",
                "state": "PR",
                "street": "centro",
                "number": 250,
                "complement": "other complement",
                "createdAt": "2020-07-14T03:27:51.396Z",
                "updatedAt": "2020-07-14T03:27:51.396Z",
                "userId": 2
            }
        ],
        "phones": [
            {
                "id": 2,
                "phone": "991239507",
                "createdAt": "2020-07-13T22:42:54.725Z",
                "updatedAt": "2020-07-13T22:42:54.725Z",
                "userId": 2
            }
        ]
      },
    ]

```

```
[2] - /users/:id
  return a specific user (by id on req.params).

  response example (id = 2);

  {
    "id": 2,
    "email": "testeusertwo@hotmail.com",
    "name": "testertwo",
    "createdAt": "2020-07-13T22:42:54.629Z",
    "updatedAt": "2020-07-14T03:27:51.431Z",
     "addresses": [
            {
                "id": 2,
                "zipCode": "84015200",
                "city": "Ponta Grossa",
                "state": "PR",
                "street": "centro",
                "number": 250,
                "complement": "other complement",
                "createdAt": "2020-07-14T03:27:51.396Z",
                "updatedAt": "2020-07-14T03:27:51.396Z",
                "userId": 2
            }
        ],
      "phones": [
            {
                "id": 2,
                "phone": "991239507",
                "createdAt": "2020-07-13T22:42:54.725Z",
                "updatedAt": "2020-07-13T22:42:54.725Z",
                "userId": 2
            }
      ]
  }

```

### Post

```
[1] - /sessions:
  login route:
  json needed to send (example) :

  {
      "email": "admin@teste.com",
      "password": "123456"
  }

  this returns:
    {
      "id": 2,
      "email": "admin@teste.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  eyJpZCI6MiwiaWF0IjoxNTk0Njc1MTQ5LCJleHAiOjE1OTUyNzk5NDl9.RKmJENSH_Llot05
      z5Yih99oEuJ8bZ8comWQx6DeZGXc"
    }
```

```
[2] - /users
  create users route:
  json needed to send (example) :
  * === required.
  {
  	"users": [
  		{
  			*"email":"testone@hotmail.com",
  			*"password": "123456",
  			*"name" : "tester",
  			"phones": [
  				{
  					"phone": "991231508"
  				}
  			]
  			"addresses:" [
  			    {
  			        "zipCode": "84015200",
  			        "street": "teste avenue 200",
  			        "city": "Ponta Grossa",
  			        "state": "PR",
  			        "number": 25,
  			        "complement": 'a complement',
  			    },
  			    {
  			        "zipCode": "84015201",
  			        "street": "teste avenue 201",
  			        "city": "Ponta Grossa",
  			        "state": "PR",
  			        "number": 26,
  			        "complement": 'a complement',
  			    }
  			]
  		},
  		{
  			*"email":"testertwo@hotmail.com",
  			*"password": "123456",
  			*"name" : "testertwo",
  			"phones": [
  				{
  					"phone": "991219508"
  				},
  				{
  					"phone": "991219507"
  				},
  			]
  		}
  	]
  }

  a user hasToMany (address and phones), so you can register multiples
  users with multiples addresses and phones, in just once.
```

### Put
```
    [1] /users
        self-edit user route, just for test experience, you may not send
        user id by req.params, the many-users-crud  catch it by your JWT token.

    json needed to send (example) :
    {
    	"name": "testing edit",
    	"email": "changinguseremail@hotmail.com",
    	"oldPassword": "123456"
    	"password": "12345678",
    	"confirmPassword: 12345678",
    	"phones": {
    		"remove": [
    			{
    				"id": 2
    			},
    			{
    				"id": 10
    			}
    		],

    		"add": [
    			{
    				"phone": "991239591"
    			},
    			{
    				"phone": "991239590"
    			}
    		],

    		"edit": [
    		    {
    		        "id": 5,
    		        "phone": "991239590
    		    }
    		]
    	},
    	"addresses": {
    		"add": [
    			{
    				"zipCode": "84015200",
    				"city": "Ponta Grossa",
    				"state": "PR",
    				"street": "av ernani batista rosas 3131",
    				"number": "3131",
    				"complement": "a complement"
    			}
    		]
    	}
    }
```

```
as you can see, its possible to put multiple addresses, and multiple phones.
How its work:
Inside of an object (addresses, or phones) you can send three arrays(no one is
required)
The arrays are: add:[], edit: [], remove:[],
 [1] add - array of objects to register on database, (the object is similar to post /users route)
 [2] edit - array of objects similar to add case but object id is required, to edit the object by id on database
 [3] remove: - array of objects "id", to remove it from database.
```

### Delete
```
    [1] /users/:id
        Delete a user from database,

    all you need to do is to send a user id in req.params

    when user is deleted, his phones and address go down too (by cascade).
```
