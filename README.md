# Stolen Realm Planner

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Character Planner for the game Stolen Realm

## Scope & Goals

The first iteration will be a skill calculator that allows users to play with and share builds. Builds will be encoded in shareable URLs, nothing will be stored on servers, etc. Skill tooltips and displayed information will be as accurate as possible based on game data and the [community wiki](https://stolen-realm.fandom.com/wiki/Stolen_Realm_Wiki). If anything looks wrong, please open an issue so I can look into it!

## TODO

- improve tooltips and work on mobile/touch experience

## Future Ideas

- include skills in damage calculations
- flesh out character stats more
- character save import
- items & equipment

## Develop

`npm install && npm start` should get your started (tested on Windows & Mac).

## Sync Data

Data is stored in a [Google Sheet](https://docs.google.com/spreadsheets/d/1pGj7okL-BUizoC09SP4qoYR-hvP7gECHim7FC8WKzW4/edit?usp=sharing) then extracted as JSON via sheetdb.io and saved to `src/data/skills.json`.

To sync the `skills.json` with new data from the sheet you can run `npm run sync-data` (this overwrites the file with whatever is in the sheet, so don't bother making any manual changes to the json as it will be lost).

## Deploy

~~`npm run deploy` will build the app and deploy to GitHub Pages.~~

Any changes to `main` branch will trigger a deploy Netlify.
