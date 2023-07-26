// Run with `npm run sync-data`
// Pulls skill data from google sheet and writes it to `src/data/skills.json` so it can be used by the app

const fs = require('fs/promises')

// NOTE: This script must be run from the root directory for this path to resolve
const JSON_FILE_PATH = 'src/data/skills.json'
const SHEET_DB_URL = 'https://sheetdb.io/api/v1/0eqoh3djx5yoo?mode=UNFORMATTED_VALUE';

(async () => {
    const chalk = (await import('chalk')).default
    const fetch = (await import('node-fetch')).default

    const chalkOrange = chalk.hex('#FF8800')
    
    async function fetchSheetData() {
        const res = await fetch(SHEET_DB_URL)
        const data = await res.json().catch((err) => {
            console.error(chalkOrange('Failed to fetch data from sheet', err))
            throw err    
        })
        if (data.length <= 0) {
            console.error(chalkOrange('Data appears to be incomplete, found no skill entries'))
            throw 'Corrupted Data'
        }
        console.log(chalk.blue('Successfully fetched data'))
        return data
    }
    
    async function saveData(data) {
        return fs.writeFile(JSON_FILE_PATH, JSON.stringify(data))
            .then(() => console.log(chalk.blue('Successfully saved data')))
            .catch((err) => {
                console.error(chalkOrange('Failed to save data to disc', err))
                throw err
            })
    }

    try {
        const data = await fetchSheetData()
        await saveData(data)
    } catch(err) {
        return console.error(chalk.red('Data Sync Failed'), err)
    }
    
    console.log(chalk.green('Data Sync Complete'))
})()
