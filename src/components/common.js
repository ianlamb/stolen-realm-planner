import styled from '@emotion/styled'

export const Container = styled.div(({ theme }) => ({
    width: '100%',
    maxWidth: theme.sizing.containerMaxWidth,
    margin: `0 auto`,
}))

export const Link = styled.a(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.highlight,
    '&:hover': {
        color: theme.palette.text.default,
    },
}))

export const HightlightText = styled.span(({ theme }) => ({
    color: theme.palette.text.highlight,
}))

export const ErrorText = styled.span(({ theme }) => ({
    color: theme.palette.text.error,
}))
