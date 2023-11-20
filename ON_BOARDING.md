# Instaling Node.js on 42
The best way to install Node.js on 42 mac pcs is through  Node Version Manager .

- We install nvm with brew, we set nvm as the brew instalation tell us:
    1. Create directory on home
    2. Set up export on our .zshrc 
    3. We can install node just using nvm `nvm install node`

# Back
## Develop on backend
0. Having `Node.js`[Above](#Instaling Node.js on 42) and `yarn` [Homebrew](https://brew.sh/) installed is required
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

 # Back with docker in dev mode (by Tomartin :D)
  I've managed to set up the backend in development mode in Docker with a 
  Makefile that allows you to start everything with a single command, 
  working on both 42's Macs and Linux. 

 ## Here are the necessary configurations to make it work (primarily on 42's Macs):
  1. Clone the repository to a location that is not "sgoinfre."
  2. Configure the .env file correctly.
  3. Add the path to the backend/srcs folder to the Docker client:
     - Configuration -> Resources -> FILE SHARING
     - Click on Apply & Restart.
  
  To start the development environment: make dev-up
  To view the Node console: make dev-logs service=dev
  For more useful commands, see: make help
 
 ## Prepare eviroment to accept several connections from pcs on 42
 1. Set .env HOST as your internal ip `ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'` Example:(HOST=http://10.11.17.2)
 2. Set diferent callbacks for 42 api
