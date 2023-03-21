import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { getPointsSpentInTree } from '../SkillCalculator/helpers'
import { skillTrees } from '../../constants'
import { Container } from '../../components'
import {
    SkillTreeIcon,
    SkillTreeIconImg,
    SkillTreeIconAnnotation,
} from '../SkillCalculator/common'

const Root = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    border: '2px solid rgba(0, 0, 0, 0.5)',
    backgroundColor: theme.palette.background.semiTransparent,
    padding: theme.spacing(2),
    gap: theme.spacing(1),
    width: '100%',
    '&:hover': {
        borderColor: theme.palette.primary,
    },
}))

const CoverLink = styled(Link)(({ theme }) => ({
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
}))

const Details = styled.div(({ theme }) => ({
    flex: 1,
}))

const Skills = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
}))

const Name = styled.div(({ theme }) => ({
    fontSize: '18px',
    color: theme.palette.text.highlight,
}))
const Timestamp = styled.div(({ theme }) => ({
    color: theme.palette.text.subdued,
}))
const Likes = styled.div(({ theme }) => ({}))

export const BuildCard = ({ build, skills }) => {
    const timestamp = new Date(build.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    const skillTreesWithPoints = skillTrees
        .reduce((acc, skillTree) => {
            const pointsSpent = getPointsSpentInTree(
                skills[skillTree.id],
                build.learnedSkills
            )
            if (pointsSpent > 0) {
                acc.push({
                    ...skillTree,
                    pointsSpent,
                    iconUrl: `skill-tree-icons/${skillTree.id}-min.png`,
                })
            }
            return acc
        }, [])
        .sort((a, b) => b.pointsSpent - a.pointsSpent)
        .map((skillTree) => (
            <SkillTreeIcon key={skillTree.id} compact={true}>
                <SkillTreeIconImg
                    src={skillTree.iconUrl}
                    alt={skillTree.title}
                />
                {skillTree.pointsSpent > 0 && (
                    <SkillTreeIconAnnotation>
                        {skillTree.pointsSpent}
                    </SkillTreeIconAnnotation>
                )}
            </SkillTreeIcon>
        ))

    return (
        <Root>
            <CoverLink to={`/calc/${build.id}`} />
            <Details>
                <Name>{build.name}</Name>
                <Timestamp>Created on {timestamp}</Timestamp>
                <Likes>Likes: {build.likes}</Likes>
            </Details>
            <Skills>
                {skillTreesWithPoints.length > 0
                    ? skillTreesWithPoints
                    : 'No Skills'}
            </Skills>
        </Root>
    )
}

export default BuildCard
