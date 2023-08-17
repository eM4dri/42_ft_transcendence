# Instaling Node.js on 42
The best way to install Node.js on 42 mac pcs is through  Node Version Manager .

- We install nvm with brew, we set nvm as the brew instalation tell us:
    1. Create directory on home
    2. Set up export on our .zshrc 
    3. We can install node just using nvm `nvm install node`

# Back
## Set up enviroment
1. Starting project directory `cd backend/srcs`
2. Run nest installation to create necesary binaries to work `yarn install`
    1. This command create `dist` & `node_modules`, never commit them 
3. Create necessary .env files. `template.env` could be useful
    1. dev mode:            `.env` 
    2. standalone mode:     `.env.test`

## Run backend as standalone
**Set up enviroment** with `.env.test` is required.
In order to manualy test the API, check documentation or develop front, we can launch our backend as a container, including portainer and adminer services. Useful commands:
1. `yarn standalone:start`
2. `yarn standalone:stop`
3. `yarn standalone:clean`

## Develop on backend
**Set up enviroment** with `.env` is required.
Useful commands:
1. Handling DB
    1. `yarn db:rm`
    2. `yarn db:up`
    3. `prisma migrate deploy` updates model of database included on 3 `yarn db:restart`(use this)
    4. `yarn db:restart`
2. Visualize DB with `npx prisma studio`
3. Run API on dev mode with logs `yarn start:dev`, it refeesh on code changes.
