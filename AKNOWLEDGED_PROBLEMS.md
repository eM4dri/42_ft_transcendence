# Aknowledged_problems
To share information about time comsuming on already known problems

- Extend Request object to avoid undefined, is better using a custom decorator like `get-user.decorator.ts` but this can be helpful https://blog.logrocket.com/extend-express-request-object-typescript/

- `Express.js` (what `NestJS` uses under) cannot differentiate between types in a querystring, that makes imposible to work two getters with param [more](https://stackoverflow.com/questions/65495791/nestjs-cant-implement-mutiple-get-methods-in-same-controller), I'm not sure if any code can diferenciate from querystring between types, personalized getters must be handle with @Query (querystring) decorator

- From back's env's template 
> Currently the only way I've found to handle alias resolution in DEV mode is using `dotenv .env` before `yarn start:dev` but this change made you disable NestJS's ability of coding while debugging with API up, forcing you to restart manualy therefore HARDCODE this for DEV is RECOMMENDED 

- `Prisma` the ORM selected to connect our Back and DB, is not able to permform reational queries like JOINs, schema should be modeled considering that