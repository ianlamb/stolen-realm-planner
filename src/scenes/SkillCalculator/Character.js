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
import { Container, Input, Label } from '../../components'

const MAX_WEAPON_DAMAGE = 9999
const MAX_ATTRIBUTE_VALUE = 9999

const Root = styled(Container)(({ theme }) => ({
    padding: theme.spacing(2),
}))

const Grid = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
}))

const Column = styled.div(({ theme }) => ({
    flex: 1,
}))

const Note = styled.div(({ theme }) => ({
    color: theme.palette.text.subdued,
    fontStyle: 'italic',
}))

const SectionTitle = styled.h3(({ theme }) => ({
    color: theme.palette.text.highlight,
}))

const StatLabel = styled(Label)(({ theme }) => ({
    marginTop: theme.spacing(1),
}))

const StatInput = ({ value, onChange, ...props }) => {
    return <Input type="number" value={value} onChange={onChange} {...props} />
}

export const Character = () => {
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
        window.gtag('event', 'change_attribute', {
            category: 'character',
            label: attr,
            value,
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
        window.gtag('event', 'change_weapon_damage', {
            category: 'character',
            value: `${weaponDamage[0]}-${weaponDamage[1]}`,
        })
    }

    return (
        <Root>
            <div>{character.name}</div>
            <div>Level: {character.level}</div>
            <Grid>
                <Column>
                    <SectionTitle>Attributes</SectionTitle>
                    {Object.keys(character.attributes).map((attr) => (
                        <div key={attr}>
                            <StatLabel>{capitalize(attr)}</StatLabel>
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
                </Column>
                <Column>
                    <SectionTitle>Equipment</SectionTitle>
                    <div>
                        <StatLabel>Min Weapon Damage</StatLabel>
                        <StatInput
                            value={character.equipment.weaponDamage[0]}
                            onChange={(event) =>
                                handleWeaponDamageChange(
                                    0,
                                    event.currentTarget.value
                                )
                            }
                        />
                        <StatLabel>Max Weapon Damage</StatLabel>
                        <StatInput
                            value={character.equipment.weaponDamage[1]}
                            onChange={(event) =>
                                handleWeaponDamageChange(
                                    1,
                                    event.currentTarget.value
                                )
                            }
                        />
                    </div>
                    <div>
                        <StatLabel>Average Weapon Damage</StatLabel>
                        <StatInput
                            value={calculateWeaponAverage(
                                character.equipment.weaponDamage
                            )}
                            readOnly
                        />
                    </div>
                </Column>
                <Column>
                    <SectionTitle>Stats</SectionTitle>
                    <div>
                        <StatLabel>Attack Power</StatLabel>
                        <StatInput
                            value={calculateAttackPower(
                                calculateWeaponAverage(
                                    character.equipment.weaponDamage
                                ),
                                character.attributes.might
                            )}
                            readOnly
                        />
                        <br />
                        Formula:{' '}
                        <code>
                            <pre>
                                weaponAverage * (0.9 + might / 100) *
                                (generalBonuses + 1)
                            </pre>
                        </code>
                    </div>
                    <div>
                        <StatLabel>Spell Power</StatLabel>
                        <StatInput
                            value={calculateSpellPower(
                                character.level,
                                character.attributes.might
                            )}
                            readOnly
                        />
                        <br />
                        Formula:
                        <code>
                            <pre>
                                (9 + characterLevel * 4) * (0.9 + might / 100) *
                                (generalBonuses + 1)
                            </pre>
                        </code>
                    </div>
                </Column>
            </Grid>
            <Note>
                NOTE: Changes made in this section do NOT yet get saved with
                your build. Currently they are just for playing around with
                ability damage numbers.
            </Note>
            <Note>
                NOTE 2: "generalBonuses" to damage are NOT yet being calculated
                in skill tooltips. This means, for example, that picking a skill
                that gives increased damage will not be reflected.
            </Note>

            <Outlet />
        </Root>
    )
}

export default Character
