import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from '@emotion/styled'

import { getBuilds } from '../../services/builds'
import { useDispatch, useAppState } from '../../store'
import { Container, Button, Spinner } from '../../components'
import { BuildCard } from './BuildCard'
import BuildFilters from './BuildFilters'

const Root = styled(Container)(({ theme }) => ({
    border: '2px solid rgba(0, 0, 0, 0.5)',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
}))

const BuildList = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
}))

const LoadMoreButton = styled(Button)(({ theme }) => ({
    display: 'block',
    margin: `${theme.spacing(2)}px auto 0`,
}))

export const Builds = () => {
    const dispatch = useDispatch()
    const { builds, skills, buildOrder, buildsLoaded } = useAppState()
    const [hasMoreBuilds, setHasMoreBuilds] = React.useState(true)

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

    const loadMoreBuilds = () => {
        getBuilds(buildOrder, true).then((moreBuilds) => {
            if (moreBuilds.length === 0) {
                setHasMoreBuilds(false)
                return
            }
            dispatch({ type: 'setBuilds', payload: [...builds, ...moreBuilds] })
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
            <LoadMoreButton onClick={loadMoreBuilds} disabled={!hasMoreBuilds}>
                {hasMoreBuilds ? 'More Builds' : 'No More Builds :('}
            </LoadMoreButton>
            <Outlet />
        </Root>
    )
}

export default Builds
