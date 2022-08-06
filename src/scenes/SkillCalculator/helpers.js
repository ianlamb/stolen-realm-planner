import { orderedSkillTrees } from '../../constants'
import { isEmpty } from 'lodash-es'

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
        return s.suid
    })
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

    try {
        const dataString = atob(dataBase64)
        console.log(
            '[decodeBuildData] Base64 to string, dataString=',
            dataString
        )

        let name, level, learnedSkills, skillData
        const kvPairs = dataString.split(';')
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

        learnedSkills = suidArray.map((suid) => {
            const skill = skills.all?.find((s) => s.suid === suid)
            return skill?.id
        })
        console.log(
            '[decodeBuildData] Read skills from SUIDs, learnedSkills=',
            learnedSkills
        )

        return { name, level, learnedSkills }
    } catch (error) {
        console.error('[decodeBuildData] Failed to decode build data', error)
    }
}

export const getMaxSkillPoints = (characterLevel) => {
    // start with 3 skill points at level 1 then earn 1 for each level
    return characterLevel + 2
}

export const calculateSkillPointsRemaining = (
    learnedSkills,
    characterLevel,
    skills
) => {
    return learnedSkills
        .map((ls) => skills.all.find((s) => s.id === ls))
        .reduce((skillPoints, skill) => {
            skillPoints -= skill.skillPointCost
            return skillPoints
        }, getMaxSkillPoints(characterLevel))
}

export const calculateScaledManaCost = (baseManaCost, characterLevel) => {
    return Math.round(
        baseManaCost + baseManaCost * (0.1 * (characterLevel - 1))
    )
}

export const calculateSpellPower = (
    characterLevel,
    might,
    generalBonuses = 0
) => {
    return Math.ceil(
        (10 + characterLevel * 4) * (0.9 + might / 100) * (generalBonuses + 1)
    )
}

export const calculateSpellDamage = (
    damageMod,
    characterLevel,
    might,
    generalBonuses = 0
) => {
    const spellPower = calculateSpellPower(
        characterLevel,
        might,
        generalBonuses
    )
    return Math.ceil(damageMod * spellPower)
}

export const calculateSpellDamageRange = (
    damageMod,
    characterLevel,
    might,
    generalBonuses = 0
) => {
    const spellPower = calculateSpellPower(
        characterLevel,
        might,
        generalBonuses
    )
    return [
        Math.ceil(damageMod * spellPower * 0.85),
        Math.ceil(damageMod * spellPower * 1.15),
    ]
}

export const calculateAttackPower = (
    weaponAverage = 1,
    might,
    generalBonuses = 0
) => {
    return Math.ceil(weaponAverage * (0.9 + might / 100) * (generalBonuses + 1))
}

export const calculateAttackDamage = (
    damageMod,
    weaponAverage,
    might,
    generalBonuses = 0
) => {
    const attackPower = calculateAttackPower(
        weaponAverage,
        might,
        generalBonuses
    )
    return Math.ceil(damageMod * attackPower)
}

export const calculateAttackDamageRange = (
    damageMod,
    weaponAverage,
    might,
    generalBonuses = 0
) => {
    const attackPower = calculateAttackPower(
        weaponAverage,
        might,
        generalBonuses
    )
    return [
        Math.ceil(damageMod * attackPower * 0.85),
        Math.ceil(damageMod * attackPower * 1.15),
    ]
}

export const calculateWeaponAverage = (weaponDamage) => {
    if (weaponDamage?.length !== 2) {
        return 1
    }
    return Math.ceil((weaponDamage[0] + weaponDamage[1]) / 2)
}

export const isLearned = (skill, learnedSkills) => {
    return !!learnedSkills.find((ls) => ls === skill.id)
}

export const getPointsSpentInTree = (skillTreeSkills, learnedSkills) => {
    return skillTreeSkills.reduce((acc, skill) => {
        if (isLearned(skill, learnedSkills)) {
            acc += skill.skillPointCost
        }
        return acc
    }, 0)
}

export const getFirstSkillTreeWithPoints = (skills, learnedSkills) => {
    return (
        orderedSkillTrees.find(
            (skillTree) =>
                getPointsSpentInTree(skills[skillTree], learnedSkills) > 0
        ) || 'fire'
    )
}

export const getPointsSpentInTier = (tier, skillTreeSkills, learnedSkills) => {
    return skillTreeSkills.reduce((acc, skill) => {
        if (isLearned(skill, learnedSkills) && skill.tier === tier) {
            acc += skill.skillPointCost
        }
        return acc
    }, 0)
}

export const requiredPointsForTier = (tier) => {
    return tier === 5 ? 10 : (tier - 1) * 2
}

export const hasRequirement = (skill, skillTreeSkills) => {
    return !!skillTreeSkills.find((s) => s.requires && s.requires === skill.id)
}

export const getSkillThatExcludesThisOne = (skill, skillTreeSkills) => {
    return skillTreeSkills.find(
        (s) => s.exclusiveWith && s.exclusiveWith === skill.id
    )
}

export const getRequiredSkill = (skill, skillTreeSkills) => {
    return skillTreeSkills.find((s) => s.id === skill.requires)
}

export const getReplacesSkill = (skill, skillTreeSkills) => {
    return skillTreeSkills.find((s) => s.id === skill.replaces)
}

export const getLearnability = (
    skill,
    learnedSkills,
    skillPointsRemaining,
    pointsSpentInThisTree,
    skillTreeSkills
) => {
    let learnability = {
        canLearn: true,
        reason: '',
    }

    const requiredPoints = requiredPointsForTier(skill.tier)
    if (requiredPoints > pointsSpentInThisTree) {
        // spent points required by tier check
        learnability.canLearn = false
        learnability.reason = `Requires ${requiredPoints} points in previous tiers.`
    } else if (skillPointsRemaining - skill.skillPointCost < 0) {
        // available skill points check
        learnability.canLearn = false
        learnability.reason = 'Not enough skill points.'
    } else {
        // requirements check
        if (!isEmpty(skill.requires)) {
            const requiredSkill = getRequiredSkill(skill, skillTreeSkills)
            if (!isLearned(requiredSkill, learnedSkills)) {
                learnability.canLearn = false
                learnability.reason = `Requires ${requiredSkill.title}.`
            }
        }
        // exclusion check
        const excludedBy = getSkillThatExcludesThisOne(skill, skillTreeSkills)
        if (excludedBy && isLearned(excludedBy, learnedSkills)) {
            learnability.canLearn = false
            learnability.reason = `Disabled by ${excludedBy.title}.`
        }
    }
    return learnability
}

export const sanitizeLearnedSkills = (
    learnedSkills,
    skills,
    characterLevel
) => {
    let results = []
    skills.all
        .filter((s) => learnedSkills.includes(s.id))
        .forEach((skill) => {
            const skillPointsRemaining = calculateSkillPointsRemaining(
                results,
                characterLevel,
                skills
            )
            const skillTreeSkills = skills[skill.skillTree]
            const pointsSpentInThisTree = getPointsSpentInTree(
                skillTreeSkills,
                results
            )
            const { canLearn } = getLearnability(
                skill,
                results,
                skillPointsRemaining,
                pointsSpentInThisTree,
                skillTreeSkills
            )
            if (canLearn) {
                results.push(skill.id)
            }
        })
    return results
}
