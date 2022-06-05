import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { getBuilds } from '../../services/builds'
import { useDispatch, useAppState } from '../../store'
import { Container, Input, Label } from '../../components'

const Root = styled(Container)(({ theme }) => ({
    border: '2px solid rgba(0, 0, 0, 0.5)',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
}))

export const BuildsScreen = () => {
    const dispatch = useDispatch()
    const { builds } = useAppState()

    React.useEffect(() => {
        if (builds && builds.length) {
            return
        }
        getBuilds().then((builds) => {
            dispatch({ type: 'setBuilds', payload: builds })
        })
    }, [])

    return (
        <Root>
            {builds.map((b) => (
                <div>
                    <Link to={`/builds/${b.id}`}>{b.id}</Link> {b.name}
                </div>
            ))}
            <Outlet />
        </Root>
    )
}

export default BuildsScreen
