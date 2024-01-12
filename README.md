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
-   Static images: nginx to serve static files (like uploaded images), to low Back end offloading this jobs to this webserv, in accordance with high availability practices (decoupling jobs)
-   Adminer: available as a separated container to ease database administration and review
-   Portainer: available as a separated container to ease docker containers administration and review

**Arquitecture**
================

Some key points about the arquitecture decisions.
-	Devops infraestructure: to allow fast on_boarding for non experienced coleagues on this tegnologies, we have a dockerized enviroment were you can deploy your whole project just having docker, furthermore there are several utilities to help working in groups, swagger is enabled to document api REST exposing workflows to understand the data, in the same adminer is available to facilitate acces to DB, Prisma as a ORM allows us to ease db migrations, for non proficient in docker Portainer is a really powerful tool available in for every SO with a browser and docker running on it.
-	Sessions: You must authenticate with a 3rd party through oauth, but once you are authorized two JWT tokens(role, refresh) to handle the whole authorization with roles, to enable or disable workflows in back and front.
-	Access DB data: with Prisma not only we are protected for SQL injections since is a layer agnostic from the type of db chosen, allowing to ease change of the type of db, but Prisma return  the info lika a MongoDB (JSON formats, no matter the chosen db), this means you cannot use relational queries. We convert this potential low as an strength, trying to serve all the info just with simple db queries, this way we minimize the overload in back making all our read faster, we get those groups of queries in front and made the relations there without impact on speed of every client, but increasing high availability, with a faster back with fewest burden.
-	Front Cache: To minimize redundant calls, to get information we tried to cache as much data in front as we can, allowing us only serve every chat/channel mesage once, again we minimize our back burden, making it more available.
-	Chat/channel: following industry standards like slack, we post mesage through HTTP and once is on db, the msg is trasmited through WS to the rest of participants. This way you have HTTP protocol to not only acknolegde the status of the request, but also eval authorization/role in a better way, without mising real time delivery msg to other chat/channel listeners.
