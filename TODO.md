**To keep tracking everything we acknowledge as TODO**
- [x] Prepare work enviroment on Docker
- [x] Create repository
- [x] Make backend docker image standalone build lighter, [may help ?](https://www.youtube.com/watch?v=JsgdvPMMdGA)
- [x] Integrate oauth2 authentication with Swagger
- [x] After 42 authentication on the user retrieval create or find in our db and return our user, to sign `JWT`
- [x] Validate 42token with user against API one you've log in
- [] Backend Middleware Layer to catch exceptions, [may hep?](https://medium.com/yavar/how-to-handle-prisma-client-errors-with-nestjs-ac81fb368c0f)
- [] Backend response wrapper to encapsulate all responses
> Simmilar fashion than middleware to catch exceptions with this we can response in a homogeneous way all our responses example for list
 ~~~
response: { 
    status: 200 (http Response status),
    offset: 10,
    limit: 10,
    data: T[],
}
~~~
- [x] Review postChat message to yourself -> disable or create your own chat
- [x] Review redirections through different pc
> Just use your ip `ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'` on .env host & APIs callback
- [x] Review gitHub Securitty alerts Dependabot remove @babel from back yanrlock
- [] Look in [wanago.io](https://wanago.io/2021/01/25/api-nestjs-chat-websockets/) handling auth with wsexceptions
- [] Toast alerts informing status's updates to user (being banned, promoted demoted, achievements...)
- [x] In channel Management as actions is a click button, make a workflow to see users profile
- [x] Send messages (chat) workflow is soved using WS to comunicate to back, instead it should be an API Rest `POST` and the service should save on db and emit to clients -> look how is developed ban/unban or mute/unmute, to try this refactory
- [] Send messages (channel) workflow is soved using WS to comunicate to back, instead it should be an API Rest `POST` and the service should save on db and emit to clients -> look how is developed ban/unban or mute/unmute, to try this refactory
- [] Endpoints to promote/demote to moderators
- [x] jwt_guard should check on which token is calling, review validate with authguards
- [] Use db scripts to create owners(team menbers), better than if looking up on code for some username (remove that conditional, and create that script to populate db, data scripts should be the latest to aply, also this scripts should be conditional in order to be able ro run serveal times)
- [] To EMM improve chat comic bubble layout size for short messages, maybe this should be useful [FLEX-GROW, FLEX-SHRINK, FLEX-BASIS, Simplified, with examples](https://www.youtube.com/watch?v=XpKc-REVwTs)
- [x] Web static assets like game images should be available at a front container in an assets directory, NOT using temporary solution of Static Profile Images Container, in PRODUCTION version of the container, I think that this should be a nginx container exposing ONE file in JS with all the info to run the webpage plus this assets folder with this static files.
- [] Convert front chat  into standalone module.
- [] Implement front lazy loading to load page as the client browse through itself
- [x] Challenge Bellow
- [x] Modal at app.module can navigate to other routes on accept
- [x] Modal triggered/opened on ws call
- [x] Modal answer ws to cancell chanllenge
- [x] Modal answer ws to accept chanllenge
- [] Emit my userchannel

- [] Use truncate pipe or avoid limitless username

- [x] moving between view create channels messages duplicate 
- [x] creating new channel dont upload new messages till you move between views
- [] time out modal challenge
- [x] To long chat messages go out beyond bubble-> look how to continue in next line
- [x] New people channel don't send new messages if you are inside channel