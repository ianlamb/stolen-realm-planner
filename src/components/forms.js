import styled from '@emotion/styled'

export const Button = styled.button(({ theme }) => ({
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.highlight,
    border: '2px solid rgba(0, 0, 0, 0.5)',
    appearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    '&:active': {
        borderColor: 'black',
    },
}))

export const Label = styled.label(({ theme }) => ({
    display: 'block',
    fontSize: '14px',
    color: theme.palette.text.subdued,
}))

export const Input = styled.input(({ theme, readOnly }) => ({
    minWidth: 100,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    color: readOnly ? theme.palette.text.subdued : theme.palette.text.default,
    border: '2px solid rgba(0, 0, 0, 0.5)',
    appearance: 'none',
    outline: 'none',
    '&:focus': !readOnly && {
        borderColor: 'rgba(0, 0, 0, 0.8)',
    },
}))

export const Select = styled.select(({ theme }) => ({
    minWidth: 100,
    padding: theme.spacing(1) - 1,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.default,
    border: '2px solid rgba(0, 0, 0, 0.5)',
    cursor: 'pointer',
    '&:focus': {
        borderColor: 'rgba(0, 0, 0, 0.8)',
    },
}))

export const Option = styled.option(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: 'black',
    cursor: 'pointer',
}))
