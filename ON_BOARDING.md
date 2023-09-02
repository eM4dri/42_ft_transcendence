# Instaling Node.js on 42
The best way to install Node.js on 42 mac pcs is through  Node Version Manager .

- We install nvm with brew, we set nvm as the brew instalation tell us:
    1. Create directory on home
    2. Set up export on our .zshrc 
    3. We can install node just using nvm `nvm install node`

# Back
## Develop on backend
0. Having `Node.js`[Above](#Instaling Node.js on 42) and `yarn` [Homebrew](https://brew.sh/) instaled is required
1. Starting project directory `cd backend/srcs`
2. Run nest installation to create necesary binaries to work `yarn install`
3. Set up enviroment, template available on ../backend/template.env, use `cp ../template.env .env` and fill in .env file
4. Start your db running `yarn db:restart`
5. Start your api in dev mode running `yarn start:dev`

## Run EVERYTHING on docker
1. Starting project directory at root `./`
2. Set up enviroment, template available on ./(root), use `cp template.env .env` and fill in .env file
3. Create the paths for your volumes `mkdir -p volumes/db volumes/portainer`
3. Run `docker compose up -d` to start 
4. Run `docker compose down -v` to stop
5. Run `docker system prune -af` to clean

## Services directions 
 - Portainer 0.0.0.0:9000 Docker Manager
 - Api 0.0.0.0:3000
 - Adminer localhost:8080 DB Mamager
 - Swagger 0.0.0.0:3000/swagge


