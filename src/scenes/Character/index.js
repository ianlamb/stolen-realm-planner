import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from '@emotion/styled'
import { capitalize, clamp } from 'lodash-es'

import {
    calculateSpellPower,
    calculateAttackPower,
    calculateWeaponAverage,
} from '../SkillCalculator/helpers'
import { useDispatch, useAppState } from '../../store'
import { Container, Input } from '../../components'

const MAX_WEAPON_DAMAGE = 9999
const MAX_ATTRIBUTE_VALUE = 9999

const Root = styled(Container)(({ theme }) => ({
    border: '2px solid rgba(0, 0, 0, 0.5)',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
}))

const StatInput = ({ value, onChange }) => {
    return <Input type="number" value={value} onChange={onChange} />
}

export const CharacterScreen = () => {
    const dispatch = useDispatch()
    const { character } = useAppState()

    const handleAttributeChange = (attr, value) => {
        value = clamp(parseInt(value, 10), 0, MAX_ATTRIBUTE_VALUE)
        dispatch({
            type: 'setAttribute',
            payload: {
                attr,
                value,
            },
        })
    }

    // weaponDamage is a length-2 array that represents min/max damage
    // therefore index of 0 is min and index of 1 is max damage
    const handleWeaponDamageChange = (index, value) => {
        let weaponDamage = [...character.equipment.weaponDamage]
        if (index === 0) {
            value = clamp(parseInt(value, 10), 0, weaponDamage[1])
        } else if (index === 1) {
            value = clamp(
                parseInt(value, 10),
                weaponDamage[0],
                MAX_WEAPON_DAMAGE
            )
        } else {
            return
        }
        weaponDamage.splice(index, 1, value)
        dispatch({ type: 'setWeaponDamage', payload: weaponDamage })
    }

    return (
        <Root>
            <div>{character.name}</div>
            <div>Level: {character.level}</div>
            <h5>Attributes</h5>
            {Object.keys(character.attributes).map((attr) => (
                <div key={attr}>
                    {capitalize(attr)}:
                    <StatInput
                        value={character.attributes[attr]}
                        onChange={(event) =>
                            handleAttributeChange(
                                attr,
                                event.currentTarget.value
                            )
                        }
                    />
                </div>
            ))}

            <h5>Stats</h5>
            <div>
                Attack Power:{' '}
                {calculateAttackPower(
                    calculateWeaponAverage(character.equipment.weaponDamage),
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

            <h5>Equipment</h5>
            <div>
                Weapon Damage:{' '}
                <StatInput
                    value={character.equipment.weaponDamage[0]}
                    onChange={(event) =>
                        handleWeaponDamageChange(0, event.currentTarget.value)
                    }
                />
                {' - '}
                <StatInput
                    value={character.equipment.weaponDamage[1]}
                    onChange={(event) =>
                        handleWeaponDamageChange(1, event.currentTarget.value)
                    }
                />
            </div>

            <br />
            <div>
                <i>
                    NOTE: Changes made in this section do NOT get saved with
                    your build. Currently they are just for playing around with
                    ability damage numbers.
                </i>
            </div>

            <Outlet />
        </Root>
    )
}

export default CharacterScreen
