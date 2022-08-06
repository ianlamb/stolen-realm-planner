# Stolen Realm Planner

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Tools for the game Stolen Realm

## Scope & Goals

The first iteration will be a skill calculator that allows users to play with and share builds. Builds will be encoded in shareable URLs, nothing will be stored on servers, etc. Skill tooltips and displayed information will be as accurate as possible based on game data and the [community wiki](https://stolen-realm.fandom.com/wiki/Stolen_Realm_Wiki). If anything looks wrong, please open an issue so I can look into it!

## TODO

-   improve tooltips and work on mobile/touch experience

## Future Ideas

-   include skills in damage calculations
-   flesh out character stats more
-   character save import
-   items & equipment

## V2 System Design

### Requirements

-   save builds on server
-   shorter URLs for sharing builds
    -   new domain name (srbuild.net? stolenrealm.tools?)
-   old build links should still work
    -   user has option to convert to new build system
-   list/search builds that are public
    -   public builds can be upvoted
-   oauth/account system?
    -   party builder?

### Constraints

-   server costs?
-   storage costs?

### API Architecture

-   build in Go
-   data stored in DynamoDB?
-   hosted on DO droplet or EC2

## Develop

Standard CRA... `npm install && npm start` should get your started (tested on Windows & Mac).

## Deploy

`npm run deploy` will build the app and deploy to GitHub Pages.
