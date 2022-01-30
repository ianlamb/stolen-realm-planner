import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { useAppState } from '../../store'

const Root = styled.div(({ theme }) => ({
    width: 1200,
    margin: '0 auto',
}))

const SkillTreeNav = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    height: 100,
}))

const NavItem = styled.div(({ theme }) => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))

const NavLink = styled(Link)(({ theme }) => ({
    width: 60,
    height: 60,
    background: 'black',
    '&:hover': {
        background: 'gray',
    },
}))

const Heading = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
}))

const SkillPointCounter = styled.div(({ theme }) => ({
    color: theme.palette.text.highlight,
}))

export function SkillCalculator({ skillTrees }) {
    const { character } = useAppState()

    return (
        <Root>
            <Heading>
                <SkillPointCounter>
                    Points Remaining: {character.skillPointsRemaining}
                </SkillPointCounter>
            </Heading>
            <SkillTreeNav>
                {skillTrees.map((skillTree) => (
                    <NavItem key={skillTree.id}>
                        <NavLink to={skillTree.id}>{skillTree.title}</NavLink>
                    </NavItem>
                ))}
            </SkillTreeNav>

            <Outlet />
        </Root>
    )
}
