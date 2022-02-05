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
    console.log('learnedSKills', character.learnedSkills)
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
    console.log('suidArray', suidArray)

    const dataString = suidArray.join('')
    console.log('dataString', dataString)

    const dataBase64 = btoa(dataString)
    console.log('dataBase64', dataBase64)

    return dataBase64
}

export const decodeBuildData = (dataBase64, skills) => {
    if (!dataBase64) {
        return
    }

    console.log('dataBase64', dataBase64)

    const dataString = atob(dataBase64)
    console.log('dataString', dataString)

    let suidArray = []
    for (let i = 0; i < dataString.length; i += 3) {
        suidArray.push(dataString.slice(i, i + 3))
    }
    console.log('suidArray', suidArray)

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
    console.log('learnedSkills', learnedSkills)

    return { learnedSkills }
}

export const calculateSkillPointsRemaining = (character, skills) => {
    return character.learnedSkills
        .map((ls) => skills.all.find((s) => s.id === ls))
        .reduce((skillPoints, skill) => {
            skillPoints -= skill.skillPointCost
            return skillPoints
        }, character.level)
}
