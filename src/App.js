import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, Global } from '@emotion/react'

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
                    <div className="App">
                        <header>
                            <h3>Stolen Realm Character Planner</h3>
                        </header>
                        <main>
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
                        </main>
                    </div>
                    <div id="tooltip-portal"></div>
                </StateProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
