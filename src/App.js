import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
    useLocation,
} from 'react-router-dom'
import Modal from 'react-modal'
import { ThemeProvider, Global, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'

import { skillTrees } from './constants'
import { theme, mq } from './lib/theme'
import { StateProvider, useAppState, useDispatch } from './store'
import { SkillCalculator } from './scenes/SkillCalculator'
import { CharacterScreen } from './scenes/Character'
import { Link, Feedback, Button } from './components'
import SkillTree from './scenes/SkillCalculator/SkillTree'
import { ReactComponent as DiscordIconRaw } from './icons/discord.svg'

Modal.setAppElement('#root')

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
    [mq[0]]: {
        fontSize: '16px',
        lineHeight: '26px',
    },
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

const ModalTitle = styled.h3(({ theme }) => ({
    marginTop: 0,
}))
const ModalBody = styled.div(({ theme }) => ({}))
const ModalActions = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
}))
const ModalButton = styled(Button)(({ theme }) => ({
    width: 100,
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
                <meta
                    property="og:url"
                    content={`${window.location.origin}${process.env.PUBLIC_URL}${location.pathname}`}
                />
            </Helmet>
            <Logo src="logo.png" alt="Stolen Realm Logo" />
            <Title>Character Planner</Title>
            <Nav>
                <NavItem
                    to={{
                        pathname: 'calc',
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
    const { search, pathname } = useLocation()
    const dispatch = useDispatch()
    const { modal } = useAppState()
    const theme = useTheme()

    const newPath = `/calc${pathname.replace('/skill-calculator', '')}`;

    const modalStyles = {
        overlay: {
            zIndex: 1,
            background: 'rgba(0, 0, 0, 0.8)',
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: 540,
            background: theme.palette.background.default,
            color: theme.palette.text.default,
            borderColor: 'rgba(0, 0, 0, 0.8)',
            borderWidth: 2,
            borderRadius: 0,
        },
    }

    const closeModal = () => {
        dispatch({ type: 'closeModal' })
    }
    return (
        <AppContentRoot>
            <Routes>
                <Route
                    path="calc"
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
                    path="/skill-calculator/*"
                    element={
                        <Navigate
                            to={{ pathname: newPath, search }} replace
                        />
                    }
                />
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={{ pathname: 'calc', search }} replace
                        />
                    }
                />
            </Routes>

            <Modal
                isOpen={modal.open}
                onRequestClose={closeModal}
                style={modalStyles}
                contentLabel="Notification Modal"
            >
                <ModalTitle>{modal.title}</ModalTitle>
                <ModalBody>{modal.message}</ModalBody>
                <ModalActions>
                    <ModalButton onClick={closeModal}>Ok</ModalButton>
                </ModalActions>
            </Modal>
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
