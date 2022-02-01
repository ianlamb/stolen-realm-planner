import styled from '@emotion/styled'

export const Container = styled.div(({ theme }) => ({
    maxWidth: theme.sizing.containerMaxWidth,
    margin: `0 auto`,
}))

export const HightlightText = styled.span(({ theme }) => ({
    color: theme.palette.text.highlight,
}))

export const ErrorText = styled.span(({ theme }) => ({
    color: theme.palette.text.error,
}))
