import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, Global } from '@emotion/react'
import styled from '@emotion/styled'

import { theme } from './lib/theme'
import { StateProvider } from './store'
import { SkillCalculator } from './scenes'
import SkillTree from './scenes/SkillCalculator/SkillTree'

const skillTrees = [
    { id: 'fire', title: 'Fire' },
    { id: 'lightning', title: 'Lightning' },
    { id: 'cold', title: 'Cold' },
    { id: 'warrior', title: 'Warrior' },
    { id: 'light', title: 'Light' },
    { id: 'ranger', title: 'Ranger' },
    { id: 'shadow', title: 'Shadow' },
    { id: 'thief', title: 'Thief' },
]

const AppRoot = styled.div(({ theme }) => ({}))

const AppContent = styled.div(({ theme }) => ({
    paddingTop: theme.spacing(2),
}))

const AppBar = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    background: theme.palette.background.appBar,
}))

export const Logo = styled.img(({ theme }) => ({
    margin: theme.spacing(1),
}))

export const Title = styled.h1(({ theme }) => ({
    fontSize: '22px',
}))

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Global
                styles={{
                    body: {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.default,
                    },
                }}
            />
            <BrowserRouter>
                <StateProvider>
                    <AppRoot>
                        <AppBar>
                            <Logo src="/logo.png" alt="Stolen Realm Logo" />
                            <Title>Character Planner</Title>
                        </AppBar>
                        <AppContent>
                            <Routes>
                                <Route
                                    path="skill-calculator"
                                    element={
                                        <SkillCalculator
                                            skillTrees={skillTrees}
                                        />
                                    }
                                >
                                    {skillTrees.map((skillTree) => (
                                        <Route
                                            key={skillTree.id}
                                            path={skillTree.id}
                                            element={
                                                <SkillTree {...skillTree} />
                                            }
                                        />
                                    ))}
                                </Route>
                                <Route
                                    path="/"
                                    element={
                                        <Navigate to="/skill-calculator" />
                                    }
                                />
                            </Routes>
                        </AppContent>
                    </AppRoot>
                    <div id="tooltip-portal"></div>
                </StateProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
