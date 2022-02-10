import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from '@emotion/styled'
import { capitalize } from 'lodash-es'

import {
    calculateSpellPower,
    calculateAttackPower,
} from '../SkillCalculator/helpers'
import { useDispatch, useAppState } from '../../store'
import { Container } from '../../components'

const Root = styled(Container)(({ theme }) => ({
    border: '2px solid rgba(0, 0, 0, 0.5)',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
}))

export const CharacterScreen = ({}) => {
    const dispatch = useDispatch()
    const { character } = useAppState()

    return (
        <Root>
            <div>{character.name}</div>
            <div>Level: {character.level}</div>
            <h5>Attributes</h5>
            {Object.keys(character.attributes).map((attr) => (
                <div>
                    {capitalize(attr)}: {character.attributes[attr]}
                </div>
            ))}

            <h5>Stats</h5>
            <div>
                Attack Power:{' '}
                {calculateAttackPower(
                    character.weaponAverage,
                    character.attributes.might
                )}
            </div>
            <div>
                Spell Power:{' '}
                {calculateSpellPower(
                    character.level,
                    character.attributes.might
                )}
            </div>

            <h5>Misc</h5>
            <div>Avg Weapon Damage: {character.weaponAverage}</div>

            <Outlet />
        </Root>
    )
}

export default CharacterScreen
