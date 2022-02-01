import React from 'react'
import { Outlet, Link, useMatch } from 'react-router-dom'
import styled from '@emotion/styled'

import { useAppState } from '../../store'

const Root = styled.div(({ theme }) => ({
    width: 1200,
    margin: '0 auto',
    border: '1px solid black',
}))

const SkillTreeNav = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    height: 100,
    padding: theme.spacing(1),
    border: '1px solid black',
}))

const NavItem = styled.div(({ theme }) => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))

const NavLink = styled(Link)(({ theme }) => ({}))

export const SkillTreeIcon = styled.div(({ theme, isActive }) => ({
    position: 'relative',
    width: theme.sizing.skillTreeIcon,
    height: theme.sizing.skillTreeIcon,
    maxWidth: theme.sizing.skillTreeIcon,
    maxHeight: theme.sizing.skillTreeIcon,
    '&:before': {
        display: 'block',
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        border: `${theme.sizing.iconBorderWidth}px solid ${
            isActive ? 'rgba(255, 255, 255, 0.5)' : 'transparent'
        }`,
    },
    '&:hover': {
        '&:before': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
    },
}))

export const SkillTreeIconImg = styled.img(({ theme }) => ({
    width: '100%',
    height: '100%',
}))

export const SkillTreeIconAnnotation = styled.div(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: `0 4px`,
    fontSize: '70%',
    textAlign: 'right',
    color: theme.palette.text.highlight,
    // background: 'rgba(0, 0, 0, 0.5)',
}))

const Heading = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
}))

const SkillPointCounter = styled.div(({ theme }) => ({
    color: theme.palette.text.highlight,
}))

export const isLearned = (skill, learnedSkills) => {
    return !!learnedSkills.find((ls) => ls === skill.id)
}

export const getPointsSpentInTree = (skillTreeSkills, learnedSkills) => {
    if (!skillTreeSkills) {
        return 0
    }

    return skillTreeSkills.reduce((acc, skill) => {
        if (isLearned(skill, learnedSkills)) {
            acc += skill.skillPointCost
        }
        return acc
    }, 0)
}

export const SkillTreeNavItem = ({ skillTree, pointsSpent }) => {
    const isActive = useMatch(`/skill-calculator/${skillTree.id}`)
    return (
        <NavItem key={skillTree.id}>
            <NavLink to={skillTree.id}>
                <SkillTreeIcon isActive={isActive}>
                    <SkillTreeIconImg
                        src={`/skill-tree-icons/${skillTree.id}.png`}
                        alt={skillTree.title}
                    />
                    <SkillTreeIconAnnotation>
                        {pointsSpent}
                    </SkillTreeIconAnnotation>
                </SkillTreeIcon>
            </NavLink>
        </NavItem>
    )
}

export const SkillCalculator = ({ skillTrees }) => {
    const { character, skills } = useAppState()

    return (
        <Root>
            <Heading>
                <SkillPointCounter>
                    Points Remaining: {character.skillPointsRemaining}
                </SkillPointCounter>
            </Heading>
            <SkillTreeNav>
                {skillTrees.map((skillTree) => (
                    <SkillTreeNavItem
                        key={skillTree.id}
                        skillTree={skillTree}
                        pointsSpent={getPointsSpentInTree(
                            skills[skillTree.id],
                            character.learnedSkills
                        )}
                    />
                ))}
            </SkillTreeNav>

            <Outlet />
        </Root>
    )
}

export default SkillCalculator
