import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from '@emotion/styled'

import { getBuilds } from '../../services/builds'
import { useDispatch, useAppState } from '../../store'
import { Container } from '../../components'
import { BuildCard } from './BuildCard'
import BuildFilters from './BuildFilters'
import { Spinner } from '../../components'

const Root = styled(Container)(({ theme }) => ({
    border: '2px solid rgba(0, 0, 0, 0.5)',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
}))

const BuildList = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
}))

export const Builds = () => {
    const dispatch = useDispatch()
    const { builds, skills, buildOrder, buildsLoaded } = useAppState()

    React.useEffect(() => {
        if (builds && builds.length) {
            return
        }
        getBuilds(buildOrder).then((builds) => {
            dispatch({ type: 'setBuilds', payload: builds })
        })
    }, [])

    const setBuildOrder = (order) => {
        dispatch({ type: 'setBuildOrder', payload: order })
        getBuilds(order).then((builds) => {
            dispatch({ type: 'setBuilds', payload: builds })
        })
    }

    if (!buildsLoaded) {
        return <Spinner />
    }

    return (
        <Root>
            <BuildFilters
                buildOrder={buildOrder}
                setBuildOrder={setBuildOrder}
            />
            <BuildList>
                {builds.map((b) => (
                    <BuildCard key={b.id} build={b} skills={skills} />
                ))}
            </BuildList>
            <Outlet />
        </Root>
    )
}

export default Builds
