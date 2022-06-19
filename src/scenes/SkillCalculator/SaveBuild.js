import React from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

import { Button, ErrorText } from '../../components'
import { useAppState, useDispatch } from '../../store'
import { createBuild, updateBuild } from '../../services/builds'

const Root = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
}))

const SaveButton = styled(Button)(({ theme }) => ({
    width: 70,
    position: 'relative',
    left: -2,
}))

export default function SaveBuild() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { buildId, character, user } = useAppState()
    const [error, setError] = React.useState()

    const save = () => {
        if (buildId && character.createdBy === user.uid) {
            console.log('This user owns this build, attempting update...')
            updateBuild(buildId, character).catch((err) => {
                console.error('Update Build Error', err)
                setError('Error saving build, please try again.')
            })
        } else {
            console.log(
                "This is either a new build or this user doesn't own it, attempting create..."
            )
            createBuild(character)
                .then(({ buildId, data }) => {
                    dispatch({ type: 'setBuildId', payload: buildId })
                    dispatch({
                        type: 'loadBuildData',
                        payload: { character: data },
                    })
                    navigate(`/calc/${buildId}`)
                })
                .catch((err) => {
                    console.error('Save Build Error', err)
                    setError('Error saving build, please try again.')
                })
        }
        window.gtag('event', 'save_build', {
            category: 'build',
        })
    }

    return (
        <Root>
            <SaveButton type="button" onClick={save}>
                Save
            </SaveButton>
            {error && <ErrorText>{error}</ErrorText>}
        </Root>
    )
}
