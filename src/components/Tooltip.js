import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

const TooltipWrapper = styled.div(({ theme }) => ({
    display: 'inline-block',
    position: 'relative',
}))

const TooltipTip = styled.div(({ theme }) => ({
    position: 'absolute',
    left: `calc(100% + ${theme.spacing(2)}px)`,
    top: `calc(50% - ${theme.spacing(4)}px)`,
    zIndex: 100,
}))

export const Tooltip = (props) => {
    let timeout
    const [active, setActive] = useState(false)
    const tipRef = React.useRef()

    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true)
        }, props.delay || 50)
    }

    const hideTip = () => {
        clearInterval(timeout)
        setActive(false)
    }

    useEffect(() => {
        let yOffset = 0
        let xOffset = 0
        const rect = tipRef.current?.getBoundingClientRect()
        if (rect) {
            const bottomScreenDiff = window.innerHeight - (rect.y + rect.height)
            const rightScreenDiff = window.innerWidth - (rect.x + rect.width)
            if (bottomScreenDiff + 8 < 0) {
                yOffset = bottomScreenDiff - 8
            }
            if (rightScreenDiff - 16 < 0) {
                xOffset = -(rect.width + 88)
            }
            // this is an anti-pattern, but in this case it's easier than wrestling with state-change/rendering loopbacks
            tipRef.current.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px)`
        }
    }, [active])

    return (
        <TooltipWrapper onMouseEnter={showTip} onMouseLeave={hideTip}>
            {props.children}
            {active && <TooltipTip ref={tipRef}>{props.content}</TooltipTip>}
        </TooltipWrapper>
    )
}

export default Tooltip
