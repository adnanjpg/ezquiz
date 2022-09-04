# ezquiz

This project is a webapp that enables you to create quizzes, share them with other people and see their results.

This project will definetely __suck__ as it is my first next.js project and one of the first react projects I've ever done.

## SETUP

1. This project uses [PlanetScale](https://planetscale.com/) for the db
    
    1. So you first need to create a db in [PlanetScale](https://planetscale.com/), by following the [official documentation](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide#create-a-database)

    2. Then you need to create an `.env` file in the root of the project, and then paste your db connection string. it will provided as a single line copy-paste from PlanetScale directly. The line will be something like this:
    `DATABASE_URL='mysql://{username}:{passowrd}@{url}/{projectname}?ssl={"rejectUnauthorized":true}'`

   1. I've put a ready script for connecting to the db locally. But first you need to authenicate, so follow these steps:
   
      1. run `pscale auth login`, this will open a tab in the browser, you should click "Confirm Code"
      
      2. run `bash scripts/connect_to_db_local.sh` which will run the ready script to connect to the db locally
         
         1. This script also can take a branch name parameter if not provided it will default to `main`, so you can call it like `bash scripts/connect_to_db_local.sh {branchname}`. you can learn about PlanetScale branches from the [official documentation](https://planetscale.com/docs/concepts/branching)
      
      3. finally you need to update your `DATABASE_URL` in `.env` file and replace your `url` with your localhost url
         - before:`DATABASE_URL='mysql://{username}:{passowrd}@`<font style="color:red">{region}.connect.psdb.cloud</font>`/{projectname}?ssl={"rejectUnauthorized":true}'`   
         - after: `DATABASE_URL='mysql://{username}:{passowrd}@`<font style="color:red">127.0.0.1:{port (default: 3309)}</font>`/{projectname}?ssl={"rejectUnauthorized":true}'`
