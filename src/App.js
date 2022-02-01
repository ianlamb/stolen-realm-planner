import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
} from 'react-router-dom'
import { ThemeProvider, Global } from '@emotion/react'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'

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
    height: theme.sizing.appBarHeight,
    background: theme.palette.background.appBar,
}))

const Logo = styled.img(({ theme }) => ({
    margin: theme.spacing(1),
}))

const Title = styled.h1(({ theme }) => ({
    fontSize: '22px',
}))

const Nav = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    padding: `0 ${theme.spacing(2)}px`,
}))

const NavItem = styled(NavLink)(({ theme, isActive }) => ({
    height: theme.sizing.appBarHeight,
    lineHeight: `${theme.sizing.appBarHeight}px`,
    verticalAlign: '',
    padding: `0 ${theme.spacing(2)}px`,
    color: theme.palette.text.default,
    textDecoration: 'none',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
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
            <Helmet>
                <meta
                    property="og:title"
                    content="Stolen Realm Character Planner"
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="" />
                <meta property="og:image" content="" />
            </Helmet>
            <BrowserRouter>
                <StateProvider>
                    <AppRoot>
                        <AppBar>
                            <Logo src="/logo.png" alt="Stolen Realm Logo" />
                            <Title>Character Planner</Title>
                            <Nav>
                                <NavItem to="skill-calculator">
                                    Skill Calculator
                                </NavItem>
                            </Nav>
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
                                    <Route
                                        path=""
                                        element={<Navigate to="fire" />}
                                    />
                                </Route>
                                <Route
                                    path="/"
                                    element={<Navigate to="skill-calculator" />}
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
