import styled from '@emotion/styled'

export const HightlightText = styled.span(({ theme }) => ({
    color: theme.palette.text.highlight,
}))

export const ErrorText = styled.span(({ theme }) => ({
    color: theme.palette.text.error,
}))
