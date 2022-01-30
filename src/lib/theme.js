const spacingMultiplier = 8

export const theme = {
    palette: {
        text: {
            default: '#f9f9f9',
            highlight: '#eb9944',
            error: '#bb3314',
        },
        background: {
            default: '#2c2724',
        },
    },
    sizing: {
        skillIcon: 56,
    },
    spacing: (amount) => amount * spacingMultiplier,
}
