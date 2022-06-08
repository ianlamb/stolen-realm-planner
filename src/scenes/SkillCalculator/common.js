import styled from '@emotion/styled'

export const SkillTreeIcon = styled.div(({ theme, isActive }) => ({
    position: 'relative',
    width: theme.sizing.skillTreeIcon,
    height: theme.sizing.skillTreeIcon,
    maxWidth: theme.sizing.skillTreeIcon,
    maxHeight: theme.sizing.skillTreeIcon,
    boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.3)',
    '&:before': {
        display: 'block',
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        border: `${theme.sizing.iconBorderWidth}px solid ${
            isActive ? 'rgba(255, 255, 255, 0.5)' : 'transparent'
        }`,
    },
    '&:hover': {
        '&:before': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
    },
}))

export const SkillTreeIconImg = styled.img(({ theme }) => ({
    width: '100%',
    height: '100%',
}))

export const SkillTreeIconAnnotation = styled.div(({ theme }) => ({
    position: 'absolute',
    top: 2,
    right: 2,
    padding: `0 4px`,
    fontSize: '12px',
    textAlign: 'right',
    color: theme.palette.text.highlight,
    background: theme.palette.background.default,
    border: `2px outset ${theme.palette.skillBorder}`,
    textShadow: '0 0 1px rgba(0, 0, 0, 1)',
}))
