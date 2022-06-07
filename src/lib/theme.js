const spacingMultiplier = 8

const breakpoints = [600, 900]

export const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`)

export const theme = {
    palette: {
        primary: '#dbb884',
        skillBorder: 'rgba(85, 65, 57, 1)',
        text: {
            default: '#f9f9f9',
            subdued: 'rgba(200, 200, 200, 0.85)',
            highlight: '#dbb884',
            error: '#bb3314',
        },
        background: {
            default: '#2c2724',
            paper: 'rgba(255, 255, 255, 0.1)',
            appBar: '#121110',
        },
    },
    fonts: {
        bodyText: 'Minion Pro, sans-serif',
        titleText: 'Trajan Pro, serif',
    },
    sizing: {
        appBarHeight: 64,
        containerMaxWidth: 1200,
        skillIcon: 56,
        skillTreeIcon: 78,
        iconBorderWidth: 3,
    },
    spacing: (amount) => amount * spacingMultiplier,
}
