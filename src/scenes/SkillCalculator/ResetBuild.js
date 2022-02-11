import React from 'react'
import styled from '@emotion/styled'
import ReactGA from 'react-ga'

import { Button } from '../../components'

const Root = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: theme.spacing(1),
    marginLeft: theme.spacing(10),
}))

export default function ResetBuild() {
    const resetBuild = () => {
        ReactGA.event({
            category: 'Skills',
            action: 'Reset Build',
        })
        window.location = `${window.location.origin}${window.location.pathname}`
    }

    return (
        <Root>
            <Button type="button" onClick={resetBuild}>
                Reset Build
            </Button>
        </Root>
    )
}
