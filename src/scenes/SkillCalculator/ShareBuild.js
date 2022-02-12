import React from 'react'
import styled from '@emotion/styled'

import { Button, Label, Input } from '../../components'
import { useAppState } from '../../store'

const Root = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
}))

const CopyButton = styled(Button)(({ theme }) => ({
    width: 70,
    position: 'relative',
    left: -2,
}))

export default function ShareBuild() {
    const defaultButtonText = 'Copy'
    const copiedButtonText = 'Copied!'

    const timeoutRef = React.useRef()

    const [buttonText, setButtonText] = React.useState(defaultButtonText)
    const { buildDataBase64 } = useAppState()

    const buildUrl = buildDataBase64
        ? `${window.location.origin}${window.location.pathname}?build=${buildDataBase64}`
        : ''

    const copyToClipboard = () => {
        if (!navigator.clipboard) {
            return
        }
        navigator.clipboard.writeText(buildUrl).then(() => {
            console.log('[ShareBuild] Saved to Clipboard:', buildUrl)
            setButtonText(copiedButtonText)
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = window.setTimeout(
                () => setButtonText(defaultButtonText),
                3000
            )
        })
        window.gtag('event', 'Copy Build URL', {
            category: 'Build',
        })
    }

    return (
        <Root>
            <Label htmlFor="name-input">Link To Build</Label>
            <Input id="name-input" type="text" value={buildUrl} readOnly />
            <CopyButton type="button" onClick={copyToClipboard}>
                {buttonText}
            </CopyButton>
        </Root>
    )
}
