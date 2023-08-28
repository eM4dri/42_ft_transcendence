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

## Run backend as standalone
1. Starting project directory `cd backend`
2. Set up enviroment, template available on ../backend/template.env, use `cp template.env .env` and fill in .env file
3. Run `docker compose up -d` 