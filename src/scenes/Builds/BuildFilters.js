import React from 'react'
import styled from '@emotion/styled'

import { Container, Button } from '../../components'

const Root = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
}))

const Label = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
}))

const Filter = styled(Button)(({ theme, isActive }) => ({
    flexBasis: 100,
    color: isActive ? theme.palette.text.highlight : theme.palette.text.default,
    borderColor: isActive ? theme.palette.text.highlight : undefined,
}))

export const BuildFilters = ({ buildOrder, setBuildOrder }) => {
    return (
        <Root>
            <Label>Sort By</Label>
            <Filter
                onClick={() => setBuildOrder('popular')}
                isActive={buildOrder === 'popular'}
            >
                Popular
            </Filter>
            <Filter
                onClick={() => setBuildOrder('new')}
                isActive={buildOrder === 'new'}
            >
                New
            </Filter>
        </Root>
    )
}

export default BuildFilters
