import React from 'react'
import styled from '@emotion/styled'

import { Label, Select, Option } from '../../components'
import { useDispatch, useAppState } from '../../store'

const MAX_LEVEL = 30
const MIN_LEVEL = 1

const Root = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
}))

export default function LevelSelect() {
    const dispatch = useDispatch()
    const { character } = useAppState()

    let availableLevels = []
    for (let i = MAX_LEVEL; i >= MIN_LEVEL; i--) {
        availableLevels.push(i)
    }

    const handleChange = (event) => {
        dispatch({ type: 'setLevel', payload: event.target.value })
        window.gtag('event', 'change_level', {
            category: 'build',
            label: event.target.value,
        })
    }

    return (
        <Root>
            <Label htmlFor="level-select">Character Level</Label>
            <Select
                id="level-select"
                onChange={handleChange}
                value={character.level}
            >
                {availableLevels.map((lvl) => (
                    <Option key={lvl}>
                        {lvl}
                        {lvl === MAX_LEVEL && ` (max)`}
                    </Option>
                ))}
            </Select>
        </Root>
    )
}
