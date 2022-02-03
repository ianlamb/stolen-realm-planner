import React from 'react'
import styled from '@emotion/styled'
import { isNil, orderBy } from 'lodash-es'

import { useDispatch, useAppState } from '../../store'
import { isLearned, getPointsSpentInTree } from './index'
import Skill from './Skill'

const SPACING_OFFSET = 16
const SKILL_OFFSET = 64

const skillOffsetBumps = {
    // warrior
    fracture: SPACING_OFFSET * 6,
    rage: SPACING_OFFSET * 8,
    'life-cleave': SPACING_OFFSET * 4,
}

const getSkillOffsets = (skills) => {
    let lastTier = 0
    let offset = SPACING_OFFSET
    return skills.reduce((acc, skill, i) => {
        if (lastTier !== skill.tier) {
            offset = SPACING_OFFSET
            lastTier = skill.tier
        } else if (skill.requires && skill.exclusiveWith) {
            if (acc[skill.exclusiveWith]) {
                offset = acc[skill.requires] + SKILL_OFFSET / 2
            } else {
                offset = acc[skill.requires] - SKILL_OFFSET / 2
            }
        } else {
            offset += SKILL_OFFSET + SPACING_OFFSET * 2
        }
        if (skillOffsetBumps[skill.id]) {
            offset += skillOffsetBumps[skill.id]
        }
        acc[skill.id] = offset
        return acc
    }, {})
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
    borderRight: '1px solid rgba(0, 0, 0, 0.5)',
}))

const PassiveSkills = styled.div(({ theme }) => ({
    position: 'relative',
    flex: 1,
    borderLeft: '1px solid rgba(0, 0, 0, 0.5)',
}))

const SectionTitle = styled.div(({ theme, align = 'left' }) => ({
    position: 'absolute',
    top: 0,
    left: align === 'left' ? 0 : 'auto',
    right: align === 'right' ? 0 : 'auto',
    padding: theme.spacing(1),
    color: theme.palette.text.highlight,
}))

const ErrorMessage = styled.div(({ theme }) => ({
    width: '100%',
    textAlign: 'center',
    color: theme.palette.text.error,
    padding: theme.spacing(1),
}))

export default function SkillTree({ id, title }) {
    const dispatch = useDispatch()
    const { skills, character } = useAppState()
    const relevantSkills = skills[id]

    if (!relevantSkills) {
        return (
            <ErrorMessage>
                Sorry, still working on this skill tree!
            </ErrorMessage>
        )
    }

    const activeSkills = relevantSkills.filter((s) => s.type === 'active')
    const passiveSkills = relevantSkills.filter((s) => s.type === 'passive')

    const activeSkillOffsetMap = getSkillOffsets(
        orderBy(activeSkills, ['tier', 'skillNum'], ['asc', 'desc'])
    )
    const passiveSkillOffsetMap = getSkillOffsets(
        orderBy(passiveSkills, ['tier', 'skillNum'], ['asc', 'asc'])
    )

    const getSkillPosition = (skill) => {
        return {
            right:
                skill.type === 'active' &&
                (activeSkillOffsetMap[skill.id] || 0),
            left:
                skill.type === 'passive' &&
                (passiveSkillOffsetMap[skill.id] || 0),
            top: Math.max(skill.tier - 1, 0) * 80 + 40,
        }
    }

    const pointsSpentInThisTree = getPointsSpentInTree(
        relevantSkills,
        character.learnedSkills
    )

    const requiredPointsForTier = (tier) => {
        return (tier - 1) * 2
    }

    const hasRequirement = (skill) => {
        return !!relevantSkills.find(
            (s) => s.requires && s.requires === skill.id
        )
    }
    const getSkillThatExcludesThisOne = (skill) => {
        return relevantSkills.find(
            (s) => s.exclusiveWith && s.exclusiveWith === skill.id
        )
    }

    const getLearnability = (skill) => {
        let learnability = {
            canLearn: true,
            reason: '',
        }

        if (character.skillPointsRemaining - skill.skillPointCost < 0) {
            // available skill points check
            learnability.canLearn = false
            learnability.reason = 'Not enough skill points'
        } else if (requiredPointsForTier(skill.tier) > pointsSpentInThisTree) {
            // spent points required by tier check
            learnability.canLearn = false
            learnability.reason = 'Not enough points spent in skill tree'
        } else {
            // requirements check
            if (!isNil(skill.requires)) {
                const requiredSkill = relevantSkills.find(
                    (s) => s.id === skill.requires
                )
                if (!isLearned(requiredSkill, character.learnedSkills)) {
                    learnability.canLearn = false
                    learnability.reason = 'Requires another skill to unlock'
                }
            }
            // exclusion check
            const excludedBy = getSkillThatExcludesThisOne(skill)
            if (excludedBy && isLearned(excludedBy, character.learnedSkills)) {
                learnability.canLearn = false
                learnability.reason = `You have already learned ${excludedBy.title}`
            }
        }
        return learnability
    }

    const toggleSkill = (skill) => {
        if (!isLearned(skill, character.learnedSkills)) {
            if (getLearnability(skill).canLearn) {
                dispatch({ type: 'learnSkill', payload: skill })
            }
        } else {
            dispatch({ type: 'unlearnSkill', payload: skill })
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
                        pos={getSkillPosition(skill)}
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
                        pos={getSkillPosition(skill)}
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
