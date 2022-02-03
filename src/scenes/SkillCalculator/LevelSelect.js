import React from 'react'
import styled from '@emotion/styled'

import { useDispatch, useAppState } from '../../store'

const MAX_LEVEL = 30
const MIN_LEVEL = 1

const Root = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
}))

const Label = styled.label(({ theme }) => ({
    display: 'block',
    fontSize: '14px',
    color: theme.palette.text.subdued,
}))

const Select = styled.select(({ theme }) => ({
    minWidth: 100,
    padding: theme.spacing(1) - 1,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.default,
    border: '2px solid rgba(0, 0, 0, 0.5)',
    cursor: 'pointer',
    '&:focus': {
        borderColor: 'rgba(0, 0, 0, 0.8)',
    },
}))

const Option = styled.option(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: 'black',
    cursor: 'pointer',
}))

export default function LevelSelect() {
    const dispatch = useDispatch()
    const { character } = useAppState()

    let availableLevels = []
    for (let i = MAX_LEVEL; i > MIN_LEVEL; i--) {
        availableLevels.push(i)
    }

    const handleChange = (event) => {
        dispatch({ type: 'setLevel', payload: event.target.value })
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
                    <Option key={lvl}>{lvl}</Option>
                ))}
            </Select>
        </Root>
    )
}
