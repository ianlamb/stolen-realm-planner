# Stolen Realm Planner

Character Planner for the game Stolen Realm

## Scope & Goals

The first iteration will just be a skill calculator to allow people to easily play with builds and share them with others. Skill tooltips and displayed information will be as accurate as possible based on game data and the [community wiki](https://stolen-realm.fandom.com/wiki/Stolen_Realm_Wiki). If anything looks wrong, please open an issue so I can look into it!

Future ideas:

-   character stats
-   items & equipment
-   character save import

## TODO before initial release

### General

-   style the shell of the app better
-   add note about what game version the data is from

### Production Readiness

-   fix ci
-   optimize images
-   add google analytics
-   add open graph

### Skill Calculator

-   add ability to share builds
-   add icons for skills
-   add tooltip data for other skill trees
    -   fire
    -   light
    -   ranger
    -   shadow
    -   thief
-   migrate data to sheetdb
    -   fire
    -   warrior
-   add connectors between related skills
-   refactor Tooltip component
-   audit pass to ensure tooltip data is accurate
