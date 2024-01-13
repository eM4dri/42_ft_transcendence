**Overview**
============
-   Web app to play Pong online against other players: challenges, ranking, ladder, different game modes and power ups.

-   Chat with persistence in db, private & group messages, friends, mute etc.

-   Api REST to persitence msg in db and websockets to deliver chat msgs and game, login with Oauth2, sessions with JWT, user privilege management, 2FA with QR via mobile app.

[![Video](https://em4dri.github.io/42_ft_transcendence/media/demo.png)](https://em4dri.github.io/42_ft_transcendence/media/demo.webm)

**Stack**
=========
A set of dockerized applications to serve at localhost:80

-   Front end: Angular + Bootstrap runing on nginx
-   Back end: NestJS + Prisma + Socket.io + JWT + Swagger
-   Database: PostgreSQL
-   Static files: separated container with nginx to serve static files
-   Adminer: available as a separated container to ease database administration and review
-   Portainer: available as a separated container to ease docker containers administration and review

**Arquitecture**
================
Some key points about the arquitecture decisions.

### Devops infraestructure:

To allow fast on_boarding for non experienced coleagues on this tegnologies, we have a dockerized enviroment were you can deploy your whole project just having docker, furthermore there are several utilities to help working in groups, swagger is enabled to document api REST exposing workflows to understand the data, in the same adminer is available to facilitate acces to DB, Prisma as a ORM allows us to ease db migrations, for non proficient in docker Portainer is a really powerful tool available in for every SO with a browser and docker running on it.

###	Sessions:
You must authenticate with a 3rd party through oauth, but once you are authorized by this 3rd, two JWT tokens were emited (role, refresh) to handle the whole authorization with roles, to enable or disable. workflows in back and front. -
-	Role token has shorter time to expire, is used to handle all authentication/ahthorization workflows
-	Refresh token has longer time to expire, is userd to refres the role token, once this is expired or backend returns unauthorized.

### Access DB data:
With Prisma not only we are protected for SQL injections since is a layer agnostic from the type of db chosen, allowing to ease change of the type of db, but Prisma return  the info lika a MongoDB (JSON formats, no matter the chosen db), this means you cannot use relational queries. We convert this potential low as an strength, trying to serve all the info just with simple db queries, this way we minimize the overload in back making all our read faster, we get those groups of queries in front and made the relations there without impact on speed of every client, but increasing high availability, with a faster back with fewest burden.

Furthermore this decision allow us in a future a really easy transformation to a microservices arquitecture.(decouple services)

### Front Cache:
To minimize redundant calls, to get information we tried to cache as much data in front as we can, allowing us only serve every chat/channel mesage once, again we minimize our back burden, making it more available.

### Static files:
To serve some static files uploaded by users like profile/channel images, we deploy a separated container with nginx, doing this again we low Back end burden, offloading this jobs to this webserv, in accordance with high availability & fault tolerance practices (decouple services)

###	Chat/channel:
Following industry standards like slack, we post mesage through HTTP and once is on db, the msg is trasmited through WS to the rest of participants. This way you have HTTP protocol to not only acknolegde the status of the request, but also eval authorization/role in a better way, without mising real time delivery msg to other chat/channel listeners.


**Features**
============
### Light/Dark mode
-   Switch whole aplication between light and dark mode (save on nav session).

### Multiple platform display
-   Improved visualization for mobile, tablet, desktop & wider desktops.

### Game
-   Pong multiplayer online with different modes. Normal challenges and power ups challenges.

-   How to play included.

### Rank
-   Rank based on your challenge games.

-   Detailed rank info of every user.

### History
-   Match history of every player. Friendly, normal challenge, and power ups challenges.

-   Detailed match info of every user.

### Chat
-	Display other other users status (online, offline, playing)

-   Private chat between users.

-   Challenge other chat users to a friendly match.

-   Spectate chat user's challenge or friendly matches.

-   Access public and private channels.

-	Create public and private channels. Including update channel avatar, uploading your an image or just rerolling between a set of diferent styles of avatars provided by DiceBear.

-   Channel privileges: owner, admins, users, banned. These privileges affect to each channel, but aren't related to website privileges.

-   Channel management: moderate channel, silence user, set channel password, kick user and change privileges of user.

### Profile
-   See/edit your user profile.

-	Update your avatar, uploading your own image or just rerolling between a set of diferent styles of avatars provided by DiceBear.

-   See other user profiles.

-   Add user to friends/blocks.

-   Enable 2fa.

### Live
-   Dashboard with live game results. Friendly, normal challenge, and power ups challenges.

-   Spectate games.

### Friends
-	Display other other users status (connected, disconnected, playing)

-   Add user to friends/blocks.

-   Challenge friend to a friendly match.

-   Spectate friend's games

### Admin
-   Website privileges including owner, admins, users, banned.

-   Channel management: moderate channel, silence user, set channel password, kick user and change privileges of user.

-   Destroy Channels.
