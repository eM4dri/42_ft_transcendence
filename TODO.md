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
- [] Review redirections through different pc
- [x] Review gitHub Securitty alerts Dependabot remove @babel from back yanrlock
- [] Look in [wanago.io](https://wanago.io/2021/01/25/api-nestjs-chat-websockets/) handling auth with wsexceptions
- [] Toast alerts informing status's updates to user
- [] In channel Management as actions is a click button, make a workflow to see users profile
- [] Send messages (channel/chat) workflow is soved using WS to comunicate to back, instead it should be an API Rest `POST` and the service should save on db and emit to clients -> look how is developed ban/unban or mute/unmute, to try this reefactory