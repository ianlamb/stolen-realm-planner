import React from 'react'
import styled from '@emotion/styled'
import { isNil } from 'lodash-es'

import { useDispatch, useAppState } from '../../store'
import { isLearned, getPointsSpentInTree } from './index'
import Skill from './Skill'

const OFFSET_MULTIPLIER = 42

// 1-12 columns
const skillLeftOffsetMap = {
    // fire
    immolate: 2,

    // warrior active
    fracture: 2,
    rage: 6,
    'double-edge': 12,
    'elemental-fracture': 1,
    'threatening-fracture': 3,
    'tempered-rage': 5,
    'beserkers-rage': 7,
    cleave: 9,
    bloodlet: 12,
    slam: 2,
    'warriors-boon': 4,
    howl: 6,
    'bleeding-cleave': 8,
    'life-cleave': 10,
    'stunning-slam': 1,
    'crushing-slam': 3,
    'vitality-break': 12,
    'unyielding-contender': 3,
    sunder: 6,

    // warrior passive
    wanderer: 1,
    'warmonger-1': 3,
    'guardian-1': 5,
    challenger: 7,
    opportunist: 1,
    'warmonger-2': 3,
    'guardian-2': 5,
    'into-the-fray': 7,
    'furious-george': 1,
    'shield-mastery': 3,
    'two-handed-mastery': 5,
    'dual-wield-mastery': 7,
    'beserkers-blood': 9,
    'bone-collector': 1,
    'blood-drinker': 3,
    executioner: 5,
    colossus: 1,
    indestructible: 3,
}

const getSkillPosition = (skill) => {
    return {
        x: (skillLeftOffsetMap[skill.id] || 0) * OFFSET_MULTIPLIER,
        y: Math.max(skill.tier - 1, 0) * 80 + 40,
    }
}

const Root = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 440,
}))

const ActiveSkills = styled.div(({ theme }) => ({
    position: 'relative',
    flex: 1,
    border: '1px solid black',
}))

const PassiveSkills = styled.div(({ theme }) => ({
    position: 'relative',
    flex: 1,
    border: '1px solid black',
}))

const SectionTitle = styled.div(({ theme, align = 'left' }) => ({
    position: 'absolute',
    top: 0,
    left: align === 'left' ? 0 : 'auto',
    right: align === 'right' ? 0 : 'auto',
    padding: theme.spacing(1),
    fontWeight: 'bold',
    color: theme.palette.text.highlight,
}))

export default function SkillTree({ id, title }) {
    const dispatch = useDispatch()
    const { skills, character } = useAppState()
    const relevantSkills = skills[id]

    if (!relevantSkills) {
        return null
    }

    const activeSkills = relevantSkills.filter((s) => s.type === 'active')
    const passiveSkills = relevantSkills.filter((s) => s.type === 'passive')

    const pointsSpentInThisTree = getPointsSpentInTree(
        relevantSkills,
        character.learnedSkills
    )

    const requiredPointsForTier = (tier) => {
        return (tier - 1) * 2
    }

    const hasReplacement = (skill) => {
        return !!relevantSkills.find(
            (s) => s.replaces && s.replaces === skill.id
        )
    }

    const hasRequirement = (skill) => {
        return !!relevantSkills.find(
            (s) => s.requires && s.requires === skill.id
        )
    }

    const getLearnability = (skill) => {
        let learnability = {
            canLearn: true,
            reason: '',
        }
        if (character.skillPointsRemaining - skill.skillPointCost < 0) {
            learnability.canLearn = false
            learnability.reason = 'Not enough skill points'
        } else if (requiredPointsForTier(skill.tier) > pointsSpentInThisTree) {
            learnability.canLearn = false
            learnability.reason = 'Not enough points spent in skill tree'
        } else if (!isNil(skill.requires)) {
            const requiredSkill = relevantSkills.find(
                (s) => s.id === skill.requires
            )
            if (!isLearned(requiredSkill, character.learnedSkills)) {
                learnability.canLearn = false
                learnability.reason = 'Requires another skill to unlock'
            }
        } else if (!isNil(skill.exclusiveWith)) {
            const exclusiveSkill = relevantSkills.find(
                (s) => s.id === skill.exclusiveWith
            )
            if (isLearned(exclusiveSkill, character.learnedSkills)) {
                learnability.canLearn = false
                learnability.reason = `You have already learned ${exclusiveSkill.title}`
            }
        }
        return learnability
    }

    const toggleSkill = (skill) => {
        if (!isLearned(skill, character.learnedSkills)) {
            if (getLearnability(skill).canLearn) {
                dispatch({ type: 'learnSkill', payload: { ...skill } })
            }
        } else {
            dispatch({ type: 'unlearnSkill', payload: { ...skill } })
        }
    }

    return (
        <Root>
            <ActiveSkills>
                <SectionTitle align="right">Active Skills</SectionTitle>
                {activeSkills.map((skill) => (
                    <Skill
                        key={skill.id}
                        skill={skill}
                        left={getSkillPosition(skill).x}
                        top={getSkillPosition(skill).y}
                        toggleSkill={toggleSkill}
                        isLearned={isLearned(skill, character.learnedSkills)}
                        hasRequirement={hasRequirement(skill)}
                        learnability={getLearnability(skill)}
                    />
                ))}
            </ActiveSkills>
            <PassiveSkills>
                <SectionTitle>Passive Skills</SectionTitle>
                {passiveSkills.map((skill) => (
                    <Skill
                        key={skill.id}
                        skill={skill}
                        left={getSkillPosition(skill).x}
                        top={getSkillPosition(skill).y}
                        toggleSkill={toggleSkill}
                        isLearned={isLearned(skill, character.learnedSkills)}
                        hasRequirement={hasRequirement(skill)}
                        learnability={getLearnability(skill)}
                    />
                ))}
            </PassiveSkills>
        </Root>
    )
}
