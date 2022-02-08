const orderedSkillTrees = [
    'fire',
    'lightning',
    'cold',
    'warrior',
    'light',
    'ranger',
    'shadow',
    'thief',
]
export const getSkillTreeID = (skillTree) => {
    return orderedSkillTrees.indexOf(skillTree)
}
export const getSkillTreeByID = (skillTreeID) => {
    return orderedSkillTrees[skillTreeID]
}

export const encodeBuildData = (character, skills) => {
    console.log(
        `[encodeBuildData] SUID is a proprietary "Special Unique ID" for skills.\nIt's a 3-character string where\nchar[0] = decimal numeric skill tree id\nchar[1] = decimal numeric skill tier id\nchar[2] = hexadecimal skill number/column\neg. Warrior - Beserker's Blood (Tier 3, Number 10) = "33a"`
    )
    console.log(
        '[encodeBuildData] Encoding... learnedSKills=',
        character.learnedSkills
    )
    const suidArray = character.learnedSkills.map((ls) => {
        const s = skills.all.find((x) => x.id === ls)
        const sUID = `${getSkillTreeID(s.skillTree)}${
            s.tier
        }${s.skillNum.toString(16)}`
        return sUID
    })
    if (suidArray.length <= 0) {
        return
    }
    console.log(
        '[encodeBuildData] Convert skills into SUIDs, suidArray=',
        suidArray
    )

    const skillData = suidArray.join('')
    console.log('[encodeBuildData] skillData=', skillData)

    const dataString = `n=${character.name};l=${character.level};s=${skillData}`
    console.log(
        '[encodeBuildData] Compile build data into key-value pairs, dataString=',
        dataString
    )

    const dataBase64 = btoa(dataString)
    console.log('[encodeBuildData] string to Base64, dataBase64=', dataBase64)

    return dataBase64
}

export const decodeBuildData = (dataBase64, skills) => {
    if (!dataBase64) {
        return
    }

    console.log('[decodeBuildData] Decoding... dataBase64=', dataBase64)

    const dataString = atob(dataBase64)
    console.log('[decodeBuildData] Base64 to string, dataString=', dataString)

    const kvPairs = dataString.split(';')
    let name, level, skillData
    kvPairs.forEach((kvp) => {
        const kvArray = kvp.split('=')
        if (kvArray[0] === 'n') {
            name = kvArray[1]
        }
        if (kvArray[0] === 'l') {
            level = parseInt(kvArray[1], 10)
        }
        if (kvArray[0] === 's') {
            skillData = kvArray[1]
        }
    })
    console.log(
        '[decodeBuildData] Build data from key-value pairs, name=',
        name,
        'level=',
        level,
        'skillData=',
        skillData
    )

    let suidArray = []
    for (let i = 0; i < skillData.length; i += 3) {
        suidArray.push(skillData.slice(i, i + 3))
    }
    console.log(
        '[decodeBuildData] Split skillData into SUIDs, suidArray=',
        suidArray
    )

    const learnedSkills = suidArray.map((suid) => {
        const skillTree = getSkillTreeByID(suid[0])
        const skillTier = parseInt(suid[1], 10)
        const skillNum = parseInt(suid[2], 16)
        const skillTreeSkills = skills[skillTree]
        const skill = skillTreeSkills?.find(
            (s) => s.tier === skillTier && s.skillNum === skillNum
        )
        return skill?.id
    })
    console.log(
        '[decodeBuildData] Read skills from SUIDs, learnedSkills=',
        learnedSkills
    )

    return { name, level, learnedSkills }
}

export const getMaxSkillPoints = (characterLevel) => {
    // start with 3 skill points at level 1 then earn 1 for each level
    return characterLevel + 2
}

export const calculateSkillPointsRemaining = (character, skills) => {
    return character.learnedSkills
        .map((ls) => skills.all.find((s) => s.id === ls))
        .reduce((skillPoints, skill) => {
            skillPoints -= skill.skillPointCost
            return skillPoints
        }, getMaxSkillPoints(character.level))
}

export const calculateScaledManaCost = (baseManaCost, characterLevel) => {
    return Math.round(
        baseManaCost + baseManaCost * (0.1 * (characterLevel - 1))
    )
}
