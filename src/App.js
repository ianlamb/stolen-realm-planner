import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
    useLocation,
} from 'react-router-dom'
import { ThemeProvider, Global } from '@emotion/react'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'

import { skillTrees } from './constants'
import { theme } from './lib/theme'
import { StateProvider, useAppState } from './store'
import { SkillCalculator } from './scenes/SkillCalculator'
import { CharacterScreen } from './scenes/Character'
import { Link, Feedback } from './components'
import SkillTree from './scenes/SkillCalculator/SkillTree'
import { ReactComponent as DiscordIconRaw } from './icons/discord.svg'

const AppRoot = styled.div(({ theme }) => ({
    minHeight: '100vh',
    overflow: 'hidden',
}))

const AppContentRoot = styled.div(({ theme }) => ({
    paddingTop: theme.spacing(2),
}))

const AppBarRoot = styled.div(({ theme }) => ({
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

const NavItem = styled(NavLink)(({ theme }) => ({
    height: theme.sizing.appBarHeight,
    lineHeight: `${theme.sizing.appBarHeight + 8}px`,
    verticalAlign: '',
    padding: `0 ${theme.spacing(2)}px`,
    color: theme.palette.text.default,
    textDecoration: 'none',
    borderBottom: `4px solid transparent`,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&.active': {
        borderColor: theme.palette.primary,
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

const AppFooterRoot = styled.div(({ theme }) => ({
    width: '100%',
    height: 30,
    lineHeight: '30px',
    fontFamily: 'Helvetica, sans-serif',
    fontSize: '12px',
    textAlign: 'center',
    color: theme.palette.text.subdued,
}))

function AppBar() {
    const location = useLocation()
    const { character } = useAppState()
    let title = 'Stolen Realm Character Planner'
    if (character.name) {
        title = `${character.name} - Stolen Realm Build`
    }
    return (
        <AppBarRoot>
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="og:type" content="website" />
                <meta
                    property="og:description"
                    content="Character Planner for Stolen Realm"
                />
                <meta
                    property="og:url"
                    content={`${window.location.origin}${process.env.PUBLIC_URL}${location.pathname}`}
                />
                <meta property="og:image" content="" />
            </Helmet>
            <Logo src="logo.png" alt="Stolen Realm Logo" />
            <Title>Character Planner</Title>
            <Nav>
                <NavItem
                    to={{
                        pathname: 'skill-calculator',
                        search: location.search,
                    }}
                >
                    Skills
                </NavItem>
                <NavItem
                    to={{ pathname: 'character', search: location.search }}
                >
                    Character
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
        </AppBarRoot>
    )
}

function AppContent() {
    const { search } = useLocation()
    return (
        <AppContentRoot>
            <Routes>
                <Route
                    path="skill-calculator"
                    element={<SkillCalculator skillTrees={skillTrees} />}
                >
                    {skillTrees.map((skillTree) => (
                        <Route
                            key={skillTree.id}
                            path={skillTree.id}
                            element={<SkillTree {...skillTree} />}
                        />
                    ))}
                    <Route
                        path=""
                        element={<Navigate to={{ pathname: 'fire', search }} />}
                    />
                </Route>
                <Route path="character" element={<CharacterScreen />} />
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={{ pathname: 'skill-calculator', search }}
                        />
                    }
                />
            </Routes>
        </AppContentRoot>
    )
}

function AppFooter() {
    return (
        <AppFooterRoot>
            This is a fan site. All game art credit belongs to{' '}
            <Link
                href="https://burst2flame.com/"
                target="_blank"
                rel="noopener"
            >
                Burst2Flame
            </Link>
            .
        </AppFooterRoot>
    )
}

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
                    'h1,h2,h3,h4,h5,h6': {
                        fontFamily: theme.fonts.titleText,
                    },
                }}
            />
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <StateProvider>
                    <AppRoot>
                        <AppBar />
                        <AppContent />
                        <AppFooter />
                        <Feedback />
                    </AppRoot>
                    <div id="tooltip-portal"></div>
                </StateProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
