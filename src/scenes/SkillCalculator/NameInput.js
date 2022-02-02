import React from 'react'
import styled from '@emotion/styled'

import { useDispatch, useAppState } from '../../store'

const Root = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
}))

const Label = styled.label(({ theme }) => ({
    display: 'block',
    fontSize: '14px',
    color: theme.palette.text.subdued,
}))

const Input = styled.input(({ theme }) => ({
    minWidth: 150,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.default,
    border: '2px solid rgba(0, 0, 0, 0.5)',
    appearance: 'none',
    outline: 'none',
    '&:focus': {
        borderColor: 'rgba(0, 0, 0, 0.8)',
    },
}))

export default function NameInput() {
    const dispatch = useDispatch()
    const { character } = useAppState()

    const handleChange = (event) => {
        dispatch({ type: 'setName', payload: event.target.value })
    }

    return (
        <Root>
            <Label for="name-input">Build Name</Label>
            <Input
                id="name-input"
                type="text"
                value={character.name}
                onChange={handleChange}
            />
        </Root>
    )
}
