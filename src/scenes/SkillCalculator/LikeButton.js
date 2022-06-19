import React from 'react'
import styled from '@emotion/styled'

import { Button, ErrorText } from '../../components'
import { useAppState, useDispatch } from '../../store'
import { likeBuild, unlikeBuild } from '../../services/builds'

const Root = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: 70,
    position: 'relative',
    left: -2,
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
            <StyledButton type="button" onClick={toggleLike}>
                {isLiked ? 'Unlike' : 'Like'}{' '}
                {character.likes !== null ? `(${character.likes})` : null}
            </StyledButton>
        </Root>
    )
}
