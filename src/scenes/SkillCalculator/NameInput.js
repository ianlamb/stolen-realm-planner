import React from 'react'
import styled from '@emotion/styled'
import ReactGA from 'react-ga'

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

    const handleBlur = (event) => {
        ReactGA.event({
            category: 'Skills',
            action: 'Change Name',
            label: event.target.value,
        })
    }

    return (
        <Root>
            <Label htmlFor="name-input">Build Name</Label>
            <Input
                id="name-input"
                type="text"
                value={character.name}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </Root>
    )
}
