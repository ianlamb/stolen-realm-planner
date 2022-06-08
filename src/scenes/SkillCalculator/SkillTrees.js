import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { skillTrees } from '../../constants'
import { getPointsSpentInTree } from './helpers'
import { useDispatch, useAppState } from '../../store'
import { Container } from '../../components'
import {
    SkillTreeIcon,
    SkillTreeIconImg,
    SkillTreeIconAnnotation,
} from './common'
import SkillTree from './SkillTree'

const Root = styled(Container)(({ theme }) => ({}))

const SkillTreeNav = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing(1),
    borderTop: '2px solid rgba(0, 0, 0, 0.5)',
    borderBottom: '2px solid rgba(0, 0, 0, 0.5)',
}))

const NavItem = styled.div(({ theme }) => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(0.5),
    cursor: 'pointer',
}))

const SkillPointCounter = styled.div(({ theme, isEmpty }) => ({
    color: isEmpty ? theme.palette.text.error : theme.palette.text.highlight,
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-end',
    whiteSpace: 'nowrap',
}))

export const SkillTreeNavItem = ({
    skillTree,
    pointsSpent,
    setActiveSkillTree,
    isActive,
}) => {
    const iconUrl = `skill-tree-icons/${skillTree.id}-min.png`
    return (
        <NavItem
            key={skillTree.id}
            onClick={() => setActiveSkillTree(skillTree.id)}
        >
            <SkillTreeIcon isActive={isActive}>
                <SkillTreeIconImg src={iconUrl} alt={skillTree.title} />
                {pointsSpent > 0 && (
                    <SkillTreeIconAnnotation>
                        {pointsSpent}
                    </SkillTreeIconAnnotation>
                )}
            </SkillTreeIcon>
        </NavItem>
    )
}

export const SkillTrees = () => {
    const { character, skills } = useAppState()
    const [activeSkillTree, setActiveSkillTree] = React.useState('fire')
    const skillTree = skillTrees.find((x) => x.id === activeSkillTree)

    return (
        <Root>
            <SkillPointCounter isEmpty={character.skillPointsRemaining <= 0}>
                Points Remaining: {character.skillPointsRemaining}
            </SkillPointCounter>
            <SkillTreeNav>
                {skillTrees.map((skillTree) => (
                    <SkillTreeNavItem
                        key={skillTree.id}
                        skillTree={skillTree}
                        pointsSpent={getPointsSpentInTree(
                            skills[skillTree.id],
                            character.learnedSkills
                        )}
                        setActiveSkillTree={setActiveSkillTree}
                        isActive={skillTree.id === activeSkillTree}
                    />
                ))}
            </SkillTreeNav>
            <SkillTree {...skillTree} />
        </Root>
    )
}

export default SkillTrees
