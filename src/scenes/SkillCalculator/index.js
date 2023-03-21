import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from '@emotion/styled'

import { getBuild } from '../../services/builds'
import useQuery from '../../lib/useQuery'
import { decodeBuildData, sanitizeLearnedSkills } from './helpers'
import { useDispatch, useAppState } from '../../store'
import { Container, Button, Spinner } from '../../components'
import SkillTrees from './SkillTrees'
import Character from './Character'
import NameInput from './NameInput'
import LevelSelect from './LevelSelect'
import ShareBuild from './ShareBuild'
import SaveBuild from './SaveBuild'
import ResetBuild from './ResetBuild'
import LikeButton from './LikeButton'

const Root = styled(Container)(({ theme }) => ({
    border: '2px solid rgba(0, 0, 0, 0.5)',
    backgroundColor: theme.palette.background.default,
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
    flex: 1,
}))

export const SkillCalculator = () => {
    const dispatch = useDispatch()
    const { character, skills, buildDataBase64, buildId } = useAppState()
    const navigate = useNavigate()
    const query = useQuery()
    const buildDataBase64FromUrl = query.get('build')
    const { buildId: queryBuildId } = useParams()
    const [activeScreen, setActiveScreen] = React.useState(<SkillTrees />)
    const [isLoading, setIsLoading] = React.useState(true)

    // on initial load, see if we have build data to import or load
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
        } else if (queryBuildId) {
            getBuild(queryBuildId).then((build) => {
                dispatch({
                    type: 'loadBuildData',
                    payload: {
                        character: build,
                        buildId: queryBuildId,
                    },
                })
            })
        } else {
            // nothing to load, fresh build
            setIsLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (buildDataBase64 || buildId) {
            setIsLoading(false)
        }
    }, [buildDataBase64, buildId])

    if (isLoading) {
        return <Spinner />
    }

    return (
        <Root>
            <Heading>
                <Options>
                    <NameInput />
                    <LevelSelect />
                    <ShareBuild />
                    <SaveBuild />
                    <ResetBuild />
                    <LikeButton buildId={buildId} />
                </Options>
            </Heading>
            <div>
                <Button onClick={() => setActiveScreen(<SkillTrees />)}>
                    Skills
                </Button>
                <Button onClick={() => setActiveScreen(<Character />)}>
                    Character
                </Button>
            </div>
            {activeScreen}
        </Root>
    )
}

export default SkillCalculator
