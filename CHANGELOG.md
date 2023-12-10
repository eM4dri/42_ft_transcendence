# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2023-12-10 - jvacaris
- **Fontend tweaks:** Delete channel button, channel usernames, new favicon.
- GameId shared with the list of playing players. 

## 2023-12-10 - tomartin
### Added
- OffCanvas para mostrar stats detalladas

## 2023-12-09 - emadriga
### Added
- 1st login workflow 'When first logged, user is prompted to add informations on his account (display name, avatar...)'
- See all chat channels (without joining) from administration panel

### Changed
- Some css fixes
- Display navbar logout, appearance

### Fixed
- Clean some WS unauthorized workflows, client can't be ready to recieve data if he is unauthorized

## 2023-12-09 - emadriga
### Added
- Finished auth workflow
- Broadcast promote/demote/ban via WS

### Fixed
- Added missing migration of banlist
- Silence front build warning , browserTarget deprecated -> use buildTarget

## 2023-12-08 - jvacaris
### Added
- New background
- Home page responsiveness improved.
- Powerup fade-in animation. They can now move when spawned (40% chance).
- Firefox shows all assets properly.

## 2023-12-08 - emadriga
### Changed
- Change ngPrisma splitbutton (channel-magnagement-actions) into icons
- Include datepicker for muteduntill
- Add localize ass datepicker boostrap demands
- On disconnect now user challenges are cancelled

## 2023-12-07 - emadriga
### Fixed
- Moving between view create channels messages duplicate, fixing mapping messages on channel, and also it seems like is bad practice not unsubscribing since every time you load a channel you re gonna subscribe again ([6-ways-to-unsubscribe-from-observables-in-angular](https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f))
- New people channels don't send new messages if you are inside channel fixed
- To long chat messages go out beyond bubble fixed
- creating new channel don't upload new messages till you move between views fixed

## 2023-12-06 - pmedina
### Added
- Changes in error management (profile info)
- Changes in css (profile info)
- Stats controller reorganized
- Small changes

## 2023-12-06 - jvacaris
### Added
- Challenge modal decoration.
- Minor styling tweaks on some pages.

## 2023-12-06 - emadriga
### Added
- Challenge match modal workflow through API REST dissmissing in case of player currently playing

## 2023-12-05 - jvacaris
### Added
- Home screen.

## 2023-12-04 - jvacaris
- Game starts after a challenge request is accepted.
### To do
- Option to choose between Friendly Classic or Modded game.

## 2023-12-04 - emadriga
### Added
- Challenge match modal workflow

## 2023-12-03 - emadriga
### Added
- Blocked and friends added to front cache
- Mute blocked users in channels and chats

## 2023-12-02 - jvacaris
### Added
- Icons specifying the type of game in the history page. Also visible in the matchmaking screen.
- Trail aura for the ball and paddles.
- Goal animation.
- Ball collision with walls animation.

## 2023-12-02 - tommy
### Added
- Truncate pipe

## 2023-12-02 - emadriga
### Added
- Added ngboostrap to handle modals and more
- Added workflow to access locked channels through modals

### Changed
- Join channels through API REST post, return info to chache via WS
- Remove unnecesary directory on nginx.conf since game img should be available at front.

## 2023-12-01 - jvacaris
### Added
- Name introduction when starting a match and when spectator joins
- Tutorial button

### Bugs
- Name introduction when spectating consecutive games speeds up uncontrollably.

## 2023-11-30½ - jvacaris
### Added
- Spectating
- Being able to play from different computers.

## 2023-11-30 - emadriga
### Added
- Added boostrap icons

### Fixed
- Update some css problems after boostrap instalation
- Use frontend assets to serve images instead of nginx static images
- Improve look & feel of menú icons

## 2023-11-29 - jvacaris
### Added
- Intro screen

## 2023-11-29 - emadriga
### Major
- User info is now stored on LocalStorage(remains on browser), instead of nonbrowser accesible storage, the reason for this is avoiding handing load data when the info should be downladed already, backup plan with userIds as username and fallback of nginx image is provided.

### Added
- Blocklist panel workflow, including adding and removng friends

## 2023-11-28½ - jvacaris
### Added
- Paddle shrink Power-Up
- Game ending screen (including player's info)
- Ball falling animation

## 2023-11-28 - emadriga
### Added
- Friend panel workflow, including adding and removng friends
- GetUserMin get all users's avatars & usernames included in an array
- Pink sidebar colors as css global vars

### Changed
- Changed http responses to more suitables one, and using fronts format to handle response
- Concat WS userIds to send to cached Users on new connections

## 2023-11-27 - jvacaris
### Added
- Modded games with 2 powerups.

## 2023-11-26 - jvacaris
### Added
- Used `emadriga`'s Interface to display current matches' status, updated in real time. It now shows the player's username and profile pictures.
- Player's stats are update according to a match's results.

## 2023-11-25 - jvacaris
### Fixed
- Matchmaking now checks whether the user is already in a match or not. Suports a user from multiple windows.

### Added
- PongTV updates in real time: new matches, match updates and match endings.

## 2023-11-25 - emadriga
### Added
- Mock up Interface spectate games

## 2023-11-25 - tommy
### Added
- Add avatar to get histotic (se puede usar de template)

## 2023-11-24 - jvacaris
### Added
- PongTV page: to view all current games with the current score (✅) and be able to join a game as a spectator (❌).

## 2023-11-23 - emadriga
### Added
- Login/logout complete workflow using tokens, 2fa & roles

## 2023-11-22 - jvacaris
### Added
- Game ends well, posts the result to our API and allows clients to start another match.
- Multiple games supported.

### To do
- Check if a player is already in a match before accessing the matchmaking.

## 2023-11-21 - emadriga
### Changed
- Chat now uses POST to save data and emits to WS

### Fixed
- Improve some strange workflows in backend
- Fix creating new chats workflows

## 2023-11-21 - jvacaris
### Added
- Basic matchmaking system. The system supports the creation of multiple games, but the game itself does not.
- Games can now be played by two people.

Started the room system to allow multiple games.

## 2023-11-18 - emadriga
### Added
- new file BUGS.md to acknowledge BUGS for the team

### Changed
- Schedule WS in new chats info in order to handle in front properly
- Updating chat workflow to use REST instead of WS

## 2023-11-18 - jvacaris
### Added
- Games can now be played normally from the page, except for multiplayer, including current score and assets.

## 2023-11-18 - tomartin
### Added
- install and POC Bootstrap

## 2023-11-16 - tomartin
### Added
- 2fa back authorization
- New bbdd User columns
- New tfa controller
- Added qrcode & speakeasy to handle tfa with a QR

## 2023-11-15 - jvacaris
### Added
- Prepared the images of the frontend for the game. They are visible but have no purpose yet.
- A path in the cgi for the retrieval of the game assets.

### Fixed
- Unmessed up the key logging for the game that I broke yesterday.

## 2023-11-14 - emadriga
### Changed
- Improve look & feel chat/channels
- Introduce new html if/for to check if it's working

## 2023-11-13 - emadriga
### Changed
- Updated to Angular 17
- Using `npm ci --legacy-peer-deps` following [Stop using “npm install” in your CI/CD pipeline](https://blog.bitsrc.io/stop-using-npm-install-in-your-ci-cd-pipeline-ba0378bbebfb)

## 2023-11-13 - jvacaris
### Added
- Client can now send keypress updates to the server (unidentified sender for now).
- Rudimentary game simulation in the server's console. Client is only sending info for now. Red paddle's static.

## 2023-11-12 - emadriga
### Added
- Solved redirections from diferent 42 host

### Changed
- Cleaning workflow avatar workflow with constants, creating avatars at new user or channel, using default svg images

### Fixed
- Fix onerror avatar fallback when image cannot be shown using default static_images, should be a front local img path to be more sure better

## 2023-11-11 - emadriga
### Added
- Refreshing front tokens following [Refreh token Angular 16](https://www.youtube.com/watch?v=aolGFrOPkVk) using our workflow ws & rest, TODO expire through ws on permisions updated
- Front Guard handling login routes from Angular Role-Based Routing Access with Angular Guard(https://medium.com/echohub/angular-role-based-routing-access-with-angular-guard-dbecaf6cd685)
- Dynamic navbar depending isAdmin
- New module administration
- Refresh token for fakeAuth login

## Changed
- Remove mocked front images

## 2023-11-09 - carce-bo
## Added
 - Added automatic UID / GID to make dev-up etc.
 - environment generator does not use a tmp file now.
## changes
 - Makefile (raiz), generate-environment.sh.

## 2023-11-09 - carce-bo
## Added
- Profile Images:
  - Module generalized for Channels and Users.
  - New field to channel and user, avatar.
  - Eliminated model ProfileImages from prisma.
  - Eliminated dependencies on ProfileImagesService everywhere.
  - Eliminated dependencies on RandomStringService everywhere.
  - ProfileImages has only 2*2 endpoints: one for url, one for images. (repeated twice because of users/image diffs)
  - static_images nginx docker now has 2 directories.
  - Added dto's to support new endpoints
- Block List:
  - Added dto's
  - getBlockList now returns string[] with all id's the requesting user has blocked.
- generate_environment.sh:
  - fixed a bug where empty lines would make export give an error.

## changes
- backend/srcs/src/(block/profile_images)/*
- backed/src/src/channel/dto/responseChannel.dto.ts
- schema.prisma
- static_images/nginx_conf
- Lots of files related to now not having to import ProfileImageService anywhere.
- generate_environment.sh

## 2023-11-05 - carce-bo
## Added
- Profile Images module
- Block Module

## changes
- template.env
- directories block, profile_images in backend/srcs/src/
- docker-compose.yml, adds an nginx service serving static images.
- Any module that uses the ProfileImageService MUST also include the RandomStringService.
- Need ThunderClient for testing file upload. body MUST contain a file.

## 2023-11-05 - tomartin
## Added
- Refresh Token
- Refresh Token Guard

## changes
- template.env

## 2023-11-04 - emadriga
### Added
- Leave channel front workflow

## 2023-11-03 - emadriga
### Added
- Ban/unban channel front workflow

## 2023-11-02 - emadriga
### Added
- Muted user get muted vía websocket
- Use eventemitter2 to avoid circular references unsing a publish subscribe arquitecture

### Changed
- try catching ws.guard TODO look in wanago.io handling auth with wsexceptions
- fix some typos channel instead of chat

## 2023-11-01 - emadriga
### Added
- client call ws to comunicate he's trully ready

## 2023-10-31 - emadriga
### Changed
- session.storage.ts remane into `cookie.constants.ts`
- cache currentClientUserId to avoid calcs
- channel management users improvements
- wrapped API Rest channel admin responses

## 2023-10-30 - emadriga
### Added
- Added front `PATCH` & `PUT` calls
- New Game Icon
- Manage all channel administration
- Added NgPrime icons

### Fixed
- Minor fixes channel permsions and Date class validators

## 2023-10-29 - emadriga
### Added
- New `GET` Channels Users to administrate
- Management channel component
### Changed
- Remove uneeded back dependencies

## 2023-10-28 - emadriga
### Added
- Post call to add new channels using next response to update cached channels
### Changed
- Remove unused chanel.service  ws subscription to new_channels_available (we use GET for that)
- Adjust channel.post response to work with front

## 2023-10-27 - emadriga
### Added
- PrimeNG utilities to use alerts and some components
- Alerts Module to handle errors

### Changed
- Upgrade back packages, fixing some vulnerabilities
- Update front packages

## 2023-10-25 - emadriga
### Changed
- Reorganize front modules, components & services
- Front date.mutations.ts to centralize date mutations

## 2023-10-24 - emadriga
### Changed
- Decoupling user data from chat & channel backs
- Cleaning Chat components

## 2023-10-23 - tomartin
### Added
- RoleGuard and Role decorator

## 2023-10-18 - emadriga
### Changed
- Componetizing chat and improve look & feel

## 2023-10-15 - emadriga
### Changed
- Improved front chat visualization, including heights using avatars at searching for new chats, and also filtering initial post as you focus the search input, this way you don't have several post asking for information. If needed could be handled on back with cache and partial paged searchs

## 2023-10-14 - emadriga
### Changed
- Moved navbar to a new component.
- Navbar horizontal vertical <-> responsive
- Improve font view organization

## 2023-10-13 - emadriga
### Changed
- Improve chat desing


## 2023-10-12 - emadriga

### Changed

- Clearing migrations.

## 2023-10-11 - emadriga
### Added
- Using avatars from `https://www.dicebear.com/`
- Serializing responses with prisma following this `https://wanago.io/2023/06/12/api-nestjs-prisma-serializing/`

### Changed
- Divide chats into components to being able to reuse.
- Move front Dtos to proper filedirectory

## 2023-10-09 - emadriga

### Added

- Demo front channels as chat joining them and talk through them.
- Serializing responses with prisma following this
  `https://wanago.io/2023/06/12/api-nestjs-prisma-serializing/`

## 2023-10-07 - emadriga

### Added

- Nginx to serve static images, user avatars and channels.

## 2023-10-06 - emadriga

### Added

- New front navegation menú channel including routing

### Changed

- Manage webSocks on new module `events.gateway` instead of chats since we
  cannot have two modules on back handling sockets

## 2023-10-04 - emadriga

### Changed

- Change landing back page to get user tokens easier

## 2023-10-03 - emadriga

### Added

- New module `channel` with 1st version of methods in API REST including channel
  workflows, not included administration roles

## 2023-10-01 - emadriga

### Fixed

- Fix grouped date (month/day vs day/month) culture problems

## 2023-09-30 - emadriga

### Changed

- Grouped chat by dates chat messages with time

## 2023-09-28 - emadriga

### Changed

- Functional chat containing websockets sharing minimal info ws to receptors
  only and just new info not old. Also displays connected users.

## 2023-09-27 - emadriga

### Changed

- Broadcast when some users connects instead of looping through connected
  sockets
- New note: handling ws ping to evaluate ws connections

## 2023-09-25 - emadriga

### Added

- Connected users handled through ws(webSockets)
- Avoid unnecessary client gets through ws, when they should be subscribed at
  connection
- New file NOTES.md to save quick thoughts about the project from other people
  working on the project.

### Changed

- Fake login accepts several fake users(42 max), calling
  `http://localhost:3000${process.env.FAKE_LOGIN_URL}/${username}`
- Little objects modifications with more sense.

## 2023-09-23 - emadriga

### Added

- Fake login to have a secondary testing account

### Changed

- Remove default front testers, until it actually test something

## 2023-09-20 - emadriga

### Changed

- Fix file permissions on running docker (back & front) on linux
- Change generate-enviroment.sh now omits comments

## 2023-09-19 - emadriga

### Added

- Athorization to http requets on front via cookies through httpinterceptors (no
  front's call implemented yet)
- Authorization front<->back thorugh WS
- 1st demo chat available, to make it work you need to send message through
  swagger to someone in other to create chat

### Changed

- Comment some unnecessary dependencies

## 2023-09-17 - emadriga

### Added

- First implementation of '[`Socket.IO`](https://socket.io/)' to handle chats
- Login in front through back
- front now handles enviroment, run `generate-environment.sh`(included in make)
  to create necesary files from .env
- login guard on front redirects to intra42

### Changed

- Added some .env variables

## 2023-09-16 - tomartin

## Change

- backend/dev-compose
- change in ON_BOARDING

## 2023-09-10 - emadriga

### Added

- New branch `sandbox` to save some test or demos. Added demo of Angular chat
  using [`Socket.IO`](https://socket.io/), more on
  /Sandbox/chat-node-mysql/README.md
- New file `TO_READ.md`

> Interesting documents to read/watch with a brief explanation about it

### Changed

- Retrieved comments on Backend Multistage Dockerfile removed in previous commit

## 2023-09-09 - tomartin

## Added

- Add Makefile
- dev-compose.yml
- backend/dev-Dockerfile

## Change

- template.env

## 2023-09-04 - emadriga

### Changed

- Remove front compiled files (/frontend/srcs/.angular &
  /frontend/srcs/node_modules)
- Changes to check apis health, should be evaluated on `docker-compose.yml` not
  `Dockerfile`
- Keep autogenerated NestJS & Angular `.gitignore` on their respective proyect
  directories, while maintain a general purpose on root directory

## 2023-08-29 - pmedina

### Added

- Added some frontend components
- Added navbar & user logo with dropdown (working)

## 2023-08-30 - emadriga

### Changed

- Moved back's `docker-compose.yml` working flow to root's directory ./
- Updated `ON_BOARDING.md` set up instructions

## 2023-08-29 - emadriga

### Added

- Added chatUserMessages to db Schema
- Added chatMessages logic to `chat.controller`(GET, PUT, POST & DELETE)
  including flow to db through service, and documented on swagger
- Added `JWT` authorization to `chat.controller`, transform previous methods to
  get user from logged user.
- Added deleteOn cascade relations to db schema

### Changed

- Improve readability of schemas, objects... (id->objectId
  user1/2->talker/listener)
- Remove unnecessary dependencies
- Added some TODOs

## 2023-08-28 - emadriga

### Changed

- Lighter docker image for backend module
- Backend setup simplified (composes, env, package.json...) to work in `dev` and
  `standalone` modes, see ON_BOARDING.md
- Modified ON_BOARDING.md acordingly

## 2023-08-27 - emadriga

### Changed

- Use login to `42API` to create new users, changes on db schemas and dto
  related to handle this data.
- `JWT` token issued with our db data (username and id)

### Added

- Added some TODOs

## 2023-08-25 - emadriga

### Changed

- Improve authentication adding a `JWT` layer [https://jwt.io/](https://jwt.io/)
  getting some ideas from.

> https://github.com/nestjs/docs.nestjs.com/issues/75
> https://medium.com/@nielsmeima/auth-in-nest-js-and-angular-463525b6e071
> https://javascript.plainenglish.io/oauth2-in-nestjs-for-social-login-google-facebook-twitter-etc-8b405d570fd2
> https://www.youtube.com/watch?v=GHTA143_b-s&t=5680s

- Improve working with `.env` following
  [typescript-process-env-type](https://bobbyhadz.com/blog/typescript-process-env-type)
- Prettier formats

## 2023-08-20 - emadriga

### Added

- Moved back's `docker-compose.yml` working flow to root's directory ./

## 2023-08-20 - emadriga

### Added

- Implement oauth2 against 42API using `Passport` authentication middleware for
  Node.js, [https://www.passportjs.org/](https://www.passportjs.org/). Following
  these links

> https://www.passportjs.org/packages/passport-42/
> https://www.youtube.com/watch?v=vGafqCNCCSs
> https://github.com/ykoh42/42OAuth-NestJS/blob/master/src/login/session.serializer.ts

## 2023-08-19 - emadriga

### Added

- New file `AKNOWLEDGED_PROBLEMS.md` to share information about time comsuming
  on already known problems

### Changed

- Migrate schemas and code to use UUID as postgres PK

## 2023-08-17 - emadriga

### Added

- Added modules for `user` & `chat`
- Added `Prisma` an ORM to handle db migrations,
  [https://www.prisma.io/](https://www.prisma.io/)

> inspired by freeCodeCamp.org
> [NestJs Course for Beginners - Create a REST API](https://www.youtube.com/watch?v=GHTA143_b-s&t=1750s)

- Running Postgres DB on docker a container use `yarn db:restart`
- Added `Swagger` to document API exposing endpoint
  [https://swagger.io/](https://swagger.io/)
- Two working modes `dev` (back development) or `standalone` (testing or front
  development)
- Added `ON_BOARDING.md` to explain how to work, 1st steps, configuration
- Added `dotenv-cli` to handle several env files (more info ON_BOARDING.md)

### Changed

- Backend uses `yarn` instead of npm

### Fix

- Binaries's directories removed (backend/srcs/dist & backend/srcs/node_modules)

## 2023-08-08 - pmedina

### Changed

- Frontend Dockerfile starts angular project. npm run start runs ng serve --host
  0.0.0.0
- frontend index slightly changed

## 2023-08-06 - pmedina

### Changed

- Update backend in docker-compose to add volume.
- Ng project & nest projects created in each container /app directory (npm run
  start to run both)

## 2023-08-04 - pmedina

### Changed

- Update frontend in docker-compose to add volume.

## 2023-06-21 - emadriga

### Added

- Add CHANGELOG.md, TODO.md & .gitignore

### Changed

- Update `README.md` with how to work with branches and commits, including
  branch_struct.png with some chatgpt desc.

## 2023-06-20 - tomartin

### Added

- New repository `ft_transcendence`
- New dev branch
- Init with docker
- Add img to branch struct

## 2023-07-11 - tomartin

### Fix

- Docker-compose.yml
- Dockerfile frontend
