const spacingMultiplier = 8

export const theme = {
    palette: {
        primary: '#bfaf8c',
        skillBorder: 'rgba(85, 65, 57, 1)',
        text: {
            default: '#f9f9f9',
            subdued: 'rgba(200, 200, 200, 0.85)',
            highlight: '#bfaf8c',
            error: '#bb3314',
        },
        background: {
            default: '#2c2724',
            paper: 'rgba(255, 255, 255, 0.1)',
            appBar: '#121110',
            button: '',
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
