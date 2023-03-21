import React from 'react'
import styled from '@emotion/styled'

import { Button } from '../../components'
import { useAppState, useDispatch } from '../../store'
import { likeBuild, unlikeBuild } from '../../services/builds'
import { ReactComponent as HeartEmptyIconRaw } from '../../icons/heart-empty.svg'
import { ReactComponent as HeartFilledIconRaw } from '../../icons/heart-filled.svg'

const Root = styled.div(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'flex-start',
    margin: theme.spacing(1),
}))

const IconButton = styled(Button)(({ theme }) => ({
    position: 'relative',
    background: 'none',
    border: 'none',
    padding: 0,
    fill: theme.palette.text.default,
    '&:hover': {
        fill: theme.palette.text.error,
    },
}))

const HeartEmptyIcon = styled(HeartEmptyIconRaw)(({ theme }) => ({
    width: theme.sizing.heartIcon,
    height: theme.sizing.heartIcon,
}))

const HeartFilledIcon = styled(HeartFilledIconRaw)(({ theme }) => ({
    height: theme.sizing.heartIcon,
    width: theme.sizing.heartIcon,
}))

export default function LikeButton({ buildId }) {
    const dispatch = useDispatch()
    const { user, character } = useAppState()
    const isLiked = character.likedBy.has(user?.uid)

    const toggleLike = () => {
        if (!isLiked) {
            dispatch({
                type: 'optimisticLike',
                payload: { buildId, userId: user.uid },
            })
            likeBuild(buildId).catch((err) => {
                // TODO request failed and we should roll back the UI state
            })
            window.gtag('event', 'like_build', {
                category: 'build',
            })
        } else {
            dispatch({
                type: 'optimisticUnlike',
                payload: { buildId, userId: user.uid },
            })
            unlikeBuild(buildId).catch((err) => {
                // TODO request failed and we should roll back the UI state
            })
            window.gtag('event', 'unlike_build', {
                category: 'build',
            })
        }
    }

    return (
        <Root>
            <IconButton
                type="button"
                onClick={toggleLike}
                title={(isLiked ? 'Unlike' : 'Like') + ' This Build'}
            >
                {isLiked ? <HeartFilledIcon /> : <HeartEmptyIcon />}
            </IconButton>
        </Root>
    )
}
