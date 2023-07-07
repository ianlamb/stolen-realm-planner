import React from 'react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { orderBy } from 'lodash-es'
import Helmet from 'react-helmet'

import { buildVersion } from '../../constants'
import { useDispatch, useAppState } from '../../store'
import {
    isLearned,
    getPointsSpentInTree,
    getLearnability,
    hasRequirement,
    getReplacesSkill,
} from './index'
import { calculateScaledManaCost } from './helpers'
import Skill from './Skill'
import { Link } from '../../components'

const SPACING_OFFSET = 16
const SKILL_OFFSET = 64

const skillOffsetBumps = {
    // warrior
    fracture: 4,
    rage: 2,
    'life-cleave': 4,
    // ranger
    'trackers-mark': 4,
    'long-shot': 1,
    'piercing-shot': 1,
    'patient-hunter': 6,
    // shadow
    'necromancer-1': 12,
    // thief
    'dagger-throw': 5,
    escape: 2,
    'enduring-evasion': 4,
    // monk
    'front-kick': 2,
    'chi-strike': 4,
    incapacitate: 2,
    'cyclone-kick': 6,
    'weapon-of-choice': 6,
}

const getSkillOffsets = (skills) => {
    let lastTier = 0
    let offset = SPACING_OFFSET
    return skills.reduce((acc, skill, i) => {
        if (lastTier !== skill.tier) {
            offset = SPACING_OFFSET
            lastTier = skill.tier
        } else if (skill.requires) {
            offset = acc[skill.requires]
            if (skill.exclusiveWith) {
                if (acc[skill.exclusiveWith]) {
                    offset += SKILL_OFFSET / 2
                } else {
                    offset -= SKILL_OFFSET / 2
                }
            }
        } else {
            offset += SKILL_OFFSET + SPACING_OFFSET * 2
        }
        if (skillOffsetBumps[skill.id]) {
            offset += SPACING_OFFSET * skillOffsetBumps[skill.id]
        }
        acc[skill.id] = offset
        return acc
    }, {})
}

const Root = styled.div(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: 450,
    // overflowX: 'auto',
}))

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const BackdropRoot = styled.div(({ theme, url, opacity }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${url})`,
    backgroundPosition: 'center bottom',
    backgroundSize: '100%',
    opacity: opacity,
    transition: opacity === 1 ? `opacity 1s` : '',
}))

const Backdrop = ({ url }) => {
    const [opacity, setOpacity] = React.useState(0)
    const [lastUrl, setLastUrl] = React.useState()
    if (url !== lastUrl) {
        setLastUrl(url)
        setOpacity(0)
        setTimeout(() => {
            setOpacity(1)
        }, 100)
        return null
    }
    return <BackdropRoot url={url} opacity={opacity} />
}

const TreeWrapper = styled.div(({ theme, bg }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    minWidth: 1196,
    background: 'rgba(25,25,25,0.75)',
}))

const TreeTitle = styled.div(({ theme }) => ({
    margin: theme.spacing(1),
    float: 'right',
}))

const ActiveSkills = styled.div(({ theme }) => ({
    position: 'relative',
    flex: 1,
    border: `1px solid ${theme.palette.skillBorder}`,
}))

const PassiveSkills = styled.div(({ theme }) => ({
    position: 'relative',
    flex: 1,
    border: `1px solid ${theme.palette.skillBorder}`,
}))

const VerticalDivider = styled.div(({ theme }) => ({
    width: theme.spacing(1),
    height: '100%',
    background: theme.palette.background.default,
}))

const SectionTitle = styled.div(({ theme, align = 'left' }) => ({
    position: 'absolute',
    top: 0,
    left: align === 'left' ? 0 : 'auto',
    right: align === 'right' ? 0 : 'auto',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    color: theme.palette.text.highlight,
    background: theme.palette.background.default,
    borderStyle: 'solid',
    borderColor: theme.palette.skillBorder,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: align === 'right' ? 1 : 0,
    borderRightWidth: align === 'left' ? 1 : 0,
}))

const ErrorMessage = styled.div(({ theme }) => ({
    width: '100%',
    textAlign: 'center',
    color: theme.palette.text.error,
    padding: theme.spacing(1),
}))

const Checkbox = styled.input(({ theme }) => ({
    position: 'relative',
    top: 2,
    marginRight: theme.spacing(0.5),
}))
const CheckboxLabel = styled.label(({ theme }) => ({
    fontSize: '14px',
    fontFamily: theme.fonts.bodyText,
    cursor: 'pointer',
}))

const BottomLeftNote = styled.div(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    color: theme.palette.text.subdued,
    fontSize: '10px',
    fontFamily: 'Courier, monospace',
    textAlign: 'right',
}))

const BottomRightNote = styled(BottomLeftNote)(({ theme }) => ({
    left: 'auto',
    right: 0,
}))

export default function SkillTree({ id, title, wikiUrl }) {
    const [shouldCalcDamage, setShouldCalcDamage] = React.useState(true)
    const dispatch = useDispatch()
    const { skills, character } = useAppState()
    const relevantSkills = skills[id]
    const ogImageUrl = `${window.location.origin}${process.env.PUBLIC_URL}/skill-tree-icons/${id}-min.png`
    const backgroundUrl = `${window.location.origin}${process.env.PUBLIC_URL}/skill-tree-bgs/${title}.jpg`

    if (!relevantSkills) {
        return <ErrorMessage>Something's wrong, sorry :(</ErrorMessage>
    }

    const activeSkills = relevantSkills.filter((s) => s.type === 'active')
    const passiveSkills = relevantSkills.filter((s) => s.type === 'passive')

    const activeSkillOffsetMap = getSkillOffsets(
        orderBy(activeSkills, ['tier', 'skillNum'], ['asc', 'desc'])
    )
    const passiveSkillOffsetMap = getSkillOffsets(
        orderBy(passiveSkills, ['tier', 'skillNum'], ['asc', 'asc'])
    )

    const getSkillPosition = (skill) => {
        return {
            right:
                skill.type === 'active' &&
                (activeSkillOffsetMap[skill.id] || 0),
            left:
                skill.type === 'passive' &&
                (passiveSkillOffsetMap[skill.id] || 0),
            top: Math.max(skill.tier - 1, 0) * 80 + 40,
        }
    }

    const pointsSpentInThisTree = getPointsSpentInTree(
        relevantSkills,
        character.learnedSkills
    )

    const toggleSkill = (skill) => {
        if (!isLearned(skill, character.learnedSkills)) {
            if (
                getLearnability(
                    skill,
                    character.learnedSkills,
                    character.skillPointsRemaining,
                    pointsSpentInThisTree,
                    relevantSkills
                ).canLearn
            ) {
                dispatch({ type: 'learnSkill', payload: skill })
                window.gtag('event', 'learn_skill', {
                    category: 'skills',
                    label: skill.title,
                })
            }
        } else {
            const futureLearnedSkills = relevantSkills.filter((s) =>
                character.learnedSkills.find(
                    (ls) => ls === s.id && s.id !== skill.id
                )
            )
            const futureLearnedSkillIds = futureLearnedSkills.map((x) => x.id)
            for (let i = 0; i < futureLearnedSkills.length; i++) {
                const skillPointsRemaining =
                    character.skillPointsRemaining +
                    futureLearnedSkills[i].skillPointCost
                if (
                    !getLearnability(
                        futureLearnedSkills[i],
                        futureLearnedSkillIds,
                        skillPointsRemaining,
                        getPointsSpentInTree(
                            relevantSkills,
                            futureLearnedSkillIds
                        ) - futureLearnedSkills[i].skillPointCost,
                        relevantSkills
                    ).canLearn
                ) {
                    console.log(
                        `Cannot unlearn ${skill.title} because it would invalidate other learned skills.`
                    )
                    return
                }
            }
            dispatch({ type: 'unlearnSkill', payload: skill })
            window.gtag('event', 'unlearn_skill', {
                category: 'skills',
                label: skill.title,
            })
        }
    }

    const mapSkills = (skills) => {
        let lastSkill
        return skills.map((skill) => {
            const isLeftSibling =
                skill.requires &&
                skill.exclusiveWith &&
                lastSkill?.exclusiveWith !== skill.id
            const isRightSibling =
                skill.requires &&
                skill.exclusiveWith &&
                lastSkill?.exclusiveWith === skill.id
            const result = (
                <Skill
                    key={skill.id}
                    skill={skill}
                    shouldCalcDamage={shouldCalcDamage}
                    scaledManaCost={calculateScaledManaCost(
                        skill.manaCost,
                        character.level
                    ) + (skill.manaPerTurn == true ? " mana per turn" : "")}
                    pos={getSkillPosition(skill)}
                    toggleSkill={toggleSkill}
                    isLearned={isLearned(skill, character.learnedSkills)}
                    hasRequirement={hasRequirement(skill, relevantSkills)}
                    learnability={getLearnability(
                        skill,
                        character.learnedSkills,
                        character.skillPointsRemaining,
                        pointsSpentInThisTree,
                        relevantSkills
                    )}
                    replaces={getReplacesSkill(skill, relevantSkills)}
                    isOnlyChild={skill.requires && !skill.exclusiveWith}
                    isLeftSibling={isLeftSibling}
                    isRightSibling={isRightSibling}
                />
            )
            lastSkill = skill
            return result
        })
    }

    return (
        <Root>
            <Helmet>
                <meta property="og:image" content={ogImageUrl} />
            </Helmet>
            <Backdrop url={backgroundUrl} />
            <TreeWrapper>
                <ActiveSkills>
                    <SectionTitle align="right">Active Skills</SectionTitle>
                    {mapSkills(activeSkills)}
                    <BottomLeftNote>
                        <Checkbox
                            id="calcDamageCheckbox"
                            type="checkbox"
                            checked={shouldCalcDamage}
                            onChange={(event) =>
                                setShouldCalcDamage(event.currentTarget.checked)
                            }
                        />
                        <CheckboxLabel htmlFor="calcDamageCheckbox">
                            Calculate Skill Damage
                        </CheckboxLabel>
                    </BottomLeftNote>
                </ActiveSkills>
                <VerticalDivider />
                <PassiveSkills>
                    <TreeTitle>
                        <Link
                            href={wikiUrl}
                            target="_blank"
                            rel="noopener"
                            title={`${title} Skill Tree Wiki`}
                        >
                            {title} Wiki
                        </Link>
                    </TreeTitle>
                    <SectionTitle>Passive Skills</SectionTitle>
                    {mapSkills(passiveSkills)}
                    <BottomRightNote>
                        Data reviewed as of client build: <b>{buildVersion}</b>
                        <br />
                        Damage calculations are still being tweaked for
                        accuracy.
                    </BottomRightNote>
                </PassiveSkills>
            </TreeWrapper>
        </Root>
    )
}
