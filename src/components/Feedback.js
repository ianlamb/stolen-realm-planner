import React from 'react'
import styled from '@emotion/styled/macro'

import { ReactComponent as FeedbackIconRaw } from '../icons/feedback.svg'

const Root = styled.div(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(4),
    right: 0,
    margin: theme.spacing(2),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
}))

const Link = styled.a(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: 38,
    transition: 'width .2s',
    overflow: 'hidden',
    padding: theme.spacing(1),
    textDecoration: 'none',
    color: theme.palette.text.highlight,
    [FeedbackIcon]: {
        fill: theme.palette.text.highlight,
    },
    '&:hover': {
        color: theme.palette.text.default,
        width: 112,
        [FeedbackIcon]: {
            fill: theme.palette.text.default,
        },
    },
}))

const FeedbackText = styled.div(({ theme }) => ({
    fontSize: '18px',
}))

const FeedbackIcon = styled(FeedbackIconRaw)(({ theme }) => ({
    position: 'relative',
    width: 24,
    height: 24,
    minWidth: 24,
    marginRight: 6,
    marginTop: -4,
    top: 4,
}))

export const Feedback = () => {
    return (
        <Root>
            <Link
                href="https://github.com/ianlamb/stolen-realm-planner/issues"
                target="_blank"
                rel="noopener"
            >
                <FeedbackIcon />
                <FeedbackText>Feedback</FeedbackText>
            </Link>
        </Root>
    )
}

export default Feedback
