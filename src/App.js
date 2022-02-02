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
import { Feedback } from './components'
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
    margin: theme.spacing(0.5),
    padding: `0 ${theme.spacing(2)}px`,
}))

const Title = styled.h1(({ theme }) => ({
    fontSize: '22px',
    lineHeight: '36px',
    fontFamily: theme.fonts.titleText,
    paddingRight: theme.spacing(2),
}))

const Nav = styled.div(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
}))

const NavSplitter = styled.div(({ theme }) => ({
    flex: 1,
}))

const NavItem = styled(NavLink)(({ theme, isActive }) => ({
    height: theme.sizing.appBarHeight,
    lineHeight: `${theme.sizing.appBarHeight + 8}px`,
    verticalAlign: '',
    padding: `0 ${theme.spacing(2)}px`,
    color: theme.palette.text.default,
    textDecoration: 'none',
    backgroundColor: isActive && 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
}))

const ExternalNavItem = styled.a(({ theme }) => ({
    height: theme.sizing.appBarHeight,
    lineHeight: `${theme.sizing.appBarHeight + 8}px`,
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
                        fontFamily: theme.fonts.bodyText,
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
                                <NavSplitter />
                                <ExternalNavItem
                                    href="https://burst2flame.com/"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    Official Game Site
                                </ExternalNavItem>
                                <ExternalNavItem
                                    href="https://discord.com/invite/SbEPwMfXCJ"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    Discord Community
                                </ExternalNavItem>
                                <ExternalNavItem
                                    href="https://github.com/ianlamb/stolen-realm-planner"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    GitHub
                                </ExternalNavItem>
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
                        <Feedback />
                    </AppRoot>
                    <div id="tooltip-portal"></div>
                </StateProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
