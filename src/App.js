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
import { Link, Feedback } from './components'
import SkillTree from './scenes/SkillCalculator/SkillTree'
import { ReactComponent as DiscordIconRaw } from './icons/discord.svg'

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
    borderBottom: isActive && `4px solid ${theme.palette.primary}`,
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

const DiscordIcon = styled(DiscordIconRaw)(({ theme }) => ({
    height: '100%',
    width: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}))

const Footer = styled.div(({ theme }) => ({
    width: '100%',
    height: 30,
    lineHeight: '30px',
    fontFamily: 'Helvetica, sans-serif',
    fontSize: '12px',
    textAlign: 'center',
    color: theme.palette.text.subdued,
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
                                <NavItem to="skill-calculator" isActive={true}>
                                    Skill Calculator
                                </NavItem>
                                <NavSplitter />
                                <ExternalNavItem
                                    href="https://discord.com/invite/SbEPwMfXCJ"
                                    target="_blank"
                                    rel="noopener"
                                    title="Stolen Realm Discord Community"
                                >
                                    <DiscordIcon />
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
                        <Footer>
                            This is a fan site. All game art credit belongs to{' '}
                            <Link
                                href="https://burst2flame.com/"
                                target="_blank"
                                rel="noopener"
                            >
                                Burst2Flame
                            </Link>
                            .
                        </Footer>
                        <Feedback />
                    </AppRoot>
                    <div id="tooltip-portal"></div>
                </StateProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
