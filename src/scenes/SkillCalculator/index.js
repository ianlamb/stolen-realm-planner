import React from 'react'
import {
    Outlet,
    Link,
    useMatch,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import styled from '@emotion/styled'
import { isEmpty } from 'lodash-es'

import useQuery from '../../lib/useQuery'
import { decodeBuildData, calculateSkillPointsRemaining } from './helpers'
import { useDispatch, useAppState } from '../../store'
import { Container } from '../../components'
import NameInput from './NameInput'
import LevelSelect from './LevelSelect'
import ShareBuild from './ShareBuild'
import ResetBuild from './ResetBuild'

const Root = styled(Container)(({ theme }) => ({
    border: '2px solid rgba(0, 0, 0, 0.5)',
    backgroundColor: theme.palette.background.paper,
}))

const SkillTreeNav = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing(1),
    borderTop: '2px solid rgba(0, 0, 0, 0.5)',
    borderBottom: '2px solid rgba(0, 0, 0, 0.5)',
}))

const NavItem = styled.div(({ theme }) => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(0.5),
}))

const NavLink = styled(Link)(({ theme }) => ({}))

export const SkillTreeIcon = styled.div(({ theme, isActive }) => ({
    position: 'relative',
    width: theme.sizing.skillTreeIcon,
    height: theme.sizing.skillTreeIcon,
    maxWidth: theme.sizing.skillTreeIcon,
    maxHeight: theme.sizing.skillTreeIcon,
    boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.3)',
    '&:before': {
        display: 'block',
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        border: `${theme.sizing.iconBorderWidth}px solid ${
            isActive ? 'rgba(255, 255, 255, 0.5)' : 'transparent'
        }`,
    },
    '&:hover': {
        '&:before': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
    },
}))

export const SkillTreeIconImg = styled.img(({ theme }) => ({
    width: '100%',
    height: '100%',
}))

export const SkillTreeIconAnnotation = styled.div(({ theme }) => ({
    position: 'absolute',
    top: 2,
    right: 2,
    padding: `0 4px`,
    fontSize: '12px',
    textAlign: 'right',
    color: theme.palette.text.highlight,
    background: theme.palette.background.default,
    border: `2px outset ${theme.palette.skillBorder}`,
    textShadow: '0 0 1px rgba(0, 0, 0, 1)',
}))

const Heading = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
}))

const Options = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
}))

const SkillPointCounter = styled.div(({ theme, isEmpty }) => ({
    color: isEmpty ? theme.palette.text.error : theme.palette.text.highlight,
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-end',
    whiteSpace: 'nowrap',
}))

export const isLearned = (skill, learnedSkills) => {
    return !!learnedSkills.find((ls) => ls === skill.id)
}

export const getPointsSpentInTree = (skillTreeSkills, learnedSkills) => {
    return skillTreeSkills.reduce((acc, skill) => {
        if (isLearned(skill, learnedSkills)) {
            acc += skill.skillPointCost
        }
        return acc
    }, 0)
}

export const getPointsSpentInTier = (tier, skillTreeSkills, learnedSkills) => {
    return skillTreeSkills.reduce((acc, skill) => {
        if (isLearned(skill, learnedSkills) && skill.tier === tier) {
            acc += skill.skillPointCost
        }
        return acc
    }, 0)
}

export const requiredPointsForTier = (tier) => {
    return tier === 5 ? 10 : (tier - 1) * 2
}

export const hasRequirement = (skill, skillTreeSkills) => {
    return !!skillTreeSkills.find((s) => s.requires && s.requires === skill.id)
}

export const getSkillThatExcludesThisOne = (skill, skillTreeSkills) => {
    return skillTreeSkills.find(
        (s) => s.exclusiveWith && s.exclusiveWith === skill.id
    )
}

export const getRequiredSkill = (skill, skillTreeSkills) => {
    return skillTreeSkills.find((s) => s.id === skill.requires)
}

export const getReplacesSkill = (skill, skillTreeSkills) => {
    return skillTreeSkills.find((s) => s.id === skill.replaces)
}

export const getLearnability = (
    skill,
    learnedSkills,
    skillPointsRemaining,
    pointsSpentInThisTree,
    skillTreeSkills
) => {
    let learnability = {
        canLearn: true,
        reason: '',
    }

    const requiredPoints = requiredPointsForTier(skill.tier)
    if (requiredPoints > pointsSpentInThisTree) {
        // spent points required by tier check
        learnability.canLearn = false
        learnability.reason = `Requires ${requiredPoints} points in previous tiers.`
    } else if (skillPointsRemaining - skill.skillPointCost < 0) {
        // available skill points check
        learnability.canLearn = false
        learnability.reason = 'Not enough skill points.'
    } else {
        // requirements check
        if (!isEmpty(skill.requires)) {
            const requiredSkill = getRequiredSkill(skill, skillTreeSkills)
            if (!isLearned(requiredSkill, learnedSkills)) {
                learnability.canLearn = false
                learnability.reason = `Requires ${requiredSkill.title}.`
            }
        }
        // exclusion check
        const excludedBy = getSkillThatExcludesThisOne(skill, skillTreeSkills)
        if (excludedBy && isLearned(excludedBy, learnedSkills)) {
            learnability.canLearn = false
            learnability.reason = `Disabled by ${excludedBy.title}.`
        }
    }
    return learnability
}

const sanitizeLearnedSkills = (learnedSkills, skills, characterLevel) => {
    let results = []
    skills.all
        .filter((s) => learnedSkills.includes(s.id))
        .forEach((skill) => {
            const skillPointsRemaining = calculateSkillPointsRemaining(
                results,
                characterLevel,
                skills
            )
            const skillTreeSkills = skills[skill.skillTree]
            const pointsSpentInThisTree = getPointsSpentInTree(
                skillTreeSkills,
                results
            )
            const { canLearn } = getLearnability(
                skill,
                results,
                skillPointsRemaining,
                pointsSpentInThisTree,
                skillTreeSkills
            )
            if (canLearn) {
                results.push(skill.id)
            }
        })
    return results
}

export const SkillTreeNavItem = ({ skillTree, pointsSpent }) => {
    const { search } = useLocation()
    const isActive = useMatch(`/calc/${skillTree.id}`)
    const iconUrl = `skill-tree-icons/${skillTree.id}-min.png`
    return (
        <NavItem key={skillTree.id}>
            <NavLink to={{ pathname: skillTree.id, search }}>
                <SkillTreeIcon isActive={isActive}>
                    <SkillTreeIconImg src={iconUrl} alt={skillTree.title} />
                    {pointsSpent > 0 && (
                        <SkillTreeIconAnnotation>
                            {pointsSpent}
                        </SkillTreeIconAnnotation>
                    )}
                </SkillTreeIcon>
            </NavLink>
        </NavItem>
    )
}

export const SkillCalculator = ({ skillTrees }) => {
    const dispatch = useDispatch()
    const { character, skills, buildDataBase64 } = useAppState()
    const navigate = useNavigate()
    const query = useQuery()
    const buildDataBase64FromUrl = query.get('build')

    // on initial load, see if we have build data to import
    React.useEffect(() => {
        const buildData = decodeBuildData(buildDataBase64FromUrl, skills)
        if (buildData) {
            const learnedSkills = sanitizeLearnedSkills(
                buildData.learnedSkills,
                skills,
                buildData.level
            )
            const partialLoadFailure =
                learnedSkills.length !== buildData.learnedSkills.length
                    ? {
                          title: 'Partial Build Corruption',
                          message: `Some skills have moved around which has affected this build. Skills that can't be learned due to not meeting requirements have had their points refunded.`,
                      }
                    : null
            buildData.learnedSkills = learnedSkills
            dispatch({
                type: 'loadBuildData',
                payload: {
                    character: buildData,
                    buildDataBase64: buildDataBase64FromUrl,
                    partialLoadFailure,
                },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // any time the build data changes in the store, update the query param
    React.useEffect(() => {
        if (buildDataBase64) {
            query.set('build', buildDataBase64)
            navigate({ search: `?${query.toString()}` })
        }
    }, [dispatch, navigate, query, buildDataBase64])

    return (
        <Root>
            <Heading>
                <Options>
                    <NameInput />
                    <LevelSelect />
                    <ShareBuild />
                    <ResetBuild />
                </Options>
                <SkillPointCounter
                    isEmpty={character.skillPointsRemaining <= 0}
                >
                    Points Remaining: {character.skillPointsRemaining}
                </SkillPointCounter>
            </Heading>
            <SkillTreeNav>
                {skillTrees.map((skillTree) => (
                    <SkillTreeNavItem
                        key={skillTree.id}
                        skillTree={skillTree}
                        pointsSpent={getPointsSpentInTree(
                            skills[skillTree.id],
                            character.learnedSkills
                        )}
                    />
                ))}
            </SkillTreeNav>

            <Outlet />
        </Root>
    )
}

export default SkillCalculator
