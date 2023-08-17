# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2023-08-17 - emadriga
### Added
- Added modules for `user` & `chat`
- Added `prisma` an ORM to handle db migrations,  [https://www.prisma.io/](https://www.prisma.io/)
> inspired by freeCodeCamp.org [NestJs Course for Beginners - Create a REST API](https://www.youtube.com/watch?v=GHTA143_b-s&t=1750s) 
- Running Postgres DB on docker a container use `yarn db:restart`
- Added `swagger` to document API exposing endpoint [https://swagger.io/](https://swagger.io/)
- Two working modes `dev` (back development) or `standalone` (testing or front development) 
- Added `ON_BOARDING.md` to explain how to work, 1st steps, configuration
- Added `dotenv-cli` to handle several env files (more info ON_BOARDING.md)

### Changed
- Backend uses `yarn` instead of npm

## 2023-08-08 - pmedina
### Changed
- Frontend Dockerfile starts angular project. npm run start runs ng serve --host 0.0.0.0
- frontend index slightly changed

## 2023-08-06 - pmedina
### Changed
- Update backend in docker-compose to add volume.
- Ng project & nest projects created in each container /app directory (npm run start to run both)

## 2023-08-04 - pmedina
### Changed
- Update frontend in docker-compose to add volume.

## 2023-06-21 - emadriga
### Added
- Add CHANGELOG.md, TODO.md & .gitignore
### Changed
- Update `README.md` with how to work with branches and commits, including branch_struct.png with some chatgpt desc.

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
