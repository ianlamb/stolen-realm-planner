import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as FeedbackIconRaw } from '../icons/feedback.svg'

const Root = styled.div(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: theme.spacing(2),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
}))

const Link = styled.a(({ theme }) => ({
    display: 'block',
    padding: theme.spacing(1),
    textDecoration: 'none',
    color: theme.palette.text.default,
    '& > svg': {
        fill: theme.palette.text.default,
    },
    '&:hover': {
        color: theme.palette.text.highlight,
        '& > svg': {
            fill: theme.palette.text.highlight,
        },
    },
}))

const FeedbackIcon = styled(FeedbackIconRaw)(({ theme }) => ({
    position: 'relative',
    width: 20,
    height: 20,
    marginRight: 6,
    marginTop: -4,
    top: 4,
}))

export const Feedback = ({}) => {
    return (
        <Root>
            <Link
                href="https://github.com/ianlamb/stolen-realm-planner/issues"
                target="_blank"
                rel="noopener"
            >
                <FeedbackIcon />
                Feedback
            </Link>
        </Root>
    )
}

export default Feedback
