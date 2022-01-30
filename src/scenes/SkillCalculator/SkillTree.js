import React from 'react'
import styled from '@emotion/styled'

import { useDispatch, useAppState } from '../../store'
import Skill from './Skill'

const OFFSET_MULTIPLIER = 42

// 1-12 columns
const skillLeftOffsetMap = {
    // fire
    immolate: 2,

    // warrior
    fracture: 2,
    rage: 6,
    'double-edge': 12,
    'elemental-fracture': 1,
    'threatening-fracture': 3,
    wanderer: 1,
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
    width: 1200,
    height: 400,
    margin: '0 auto',
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
    const activeSkills = relevantSkills.filter((s) => s.type === 'active')
    const passiveSkills = relevantSkills.filter((s) => s.type === 'passive')

    const isLearned = (skill) => {
        return !!character.learnedSkills.find((ls) => ls === skill.id)
    }

    const toggleSkill = (skill) => {
        if (isLearned(skill)) {
            dispatch({ type: 'unlearnSkill', payload: { ...skill } })
        } else {
            dispatch({ type: 'learnSkill', payload: { ...skill } })
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
                        isLearned={isLearned(skill)}
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
                        isLearned={isLearned(skill)}
                    />
                ))}
            </PassiveSkills>
        </Root>
    )
}
