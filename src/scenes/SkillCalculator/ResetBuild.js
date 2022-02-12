import React from 'react'
import styled from '@emotion/styled'

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
        window.gtag('event', 'reset_build', {
            category: 'build',
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
