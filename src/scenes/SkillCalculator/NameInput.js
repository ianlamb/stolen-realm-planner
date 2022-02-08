import React from 'react'
import styled from '@emotion/styled'
import { Label, Input } from '../../components'

import { useDispatch, useAppState } from '../../store'

const Root = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
}))

export default function NameInput() {
    const dispatch = useDispatch()
    const { character } = useAppState()

    const handleChange = (event) => {
        dispatch({ type: 'setName', payload: event.target.value })
    }

    return (
        <Root>
            <Label htmlFor="name-input">Build Name</Label>
            <Input
                id="name-input"
                type="text"
                value={character.name}
                onChange={handleChange}
            />
        </Root>
    )
}
