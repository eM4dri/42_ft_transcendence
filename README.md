**Overview**
============

-   Web app to play Pong online against other players: challenges, ranking, ladder, different game modes and power ups.

-   Chat with persistence in db, private & group messages, friends, mute etc.

-   Api REST to persitence msg in db and websockets to deliver chat msgs and game, login with Oauth2, seesion with JWT, user privilege management, 2FA with QR via mobile app.

[![Video](https://em4dri.github.io/42_ft_transcendence/media/demo.png)](https://em4dri.github.io/42_ft_transcendence/media/demo.webm)


**Stack**
=========

A set of dockerized applications to serve at localhost:80

-   Front end: Angular + Bootstrap
-   Back end: NestJS + Prisma + Socket.io + JWT + Swagger
-   Database: PostgreSQL
-   Web server: nginx
-
