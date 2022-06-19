import React, { createContext, useReducer, useContext } from 'react'
import skills from './data/skills.json'
import {
    encodeBuildData,
    calculateSkillPointsRemaining,
    getMaxSkillPoints,
} from './scenes/SkillCalculator/helpers'

const getSkills = (skillTree) => skills.filter((s) => s.skillTree === skillTree)

const DEFAULT_LEVEL = 30

const initialState = {
    user: null,
    builds: [],
    buildDataBase64: null,
    buildId: null,
    character: {
        name: '',
        level: DEFAULT_LEVEL,
        skillPointsRemaining: getMaxSkillPoints(DEFAULT_LEVEL),
        learnedSkills: [],
        attributes: {
            might: 8,
            dexterity: 8,
            vitality: 8,
            intelligence: 8,
            reflex: 8,
        },
        equipment: {
            weaponDamage: [1, 3],
        },
        likes: null,
        likedBy: new Set(),
    },
    skills: {
        all: skills,
        fire: getSkills('fire'),
        lightning: getSkills('lightning'),
        cold: getSkills('cold'),
        warrior: getSkills('warrior'),
        light: getSkills('light'),
        ranger: getSkills('ranger'),
        shadow: getSkills('shadow'),
        thief: getSkills('thief'),
        monk: getSkills('monk'),
    },
    modal: {
        message: '',
        open: false,
    },
}

export const store = createContext(initialState)
const { Provider } = store

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        let newState
        let mergedCharacter
        let build
        switch (action.type) {
            case 'setName':
                mergedCharacter = {
                    ...state.character,
                    name: action.payload,
                }
                newState = {
                    ...state,
                    buildDataBase64: encodeBuildData(
                        mergedCharacter,
                        state.skills
                    ),
                    character: mergedCharacter,
                }
                break
            case 'setLevel':
                const newLevel = parseInt(action.payload, 10)
                mergedCharacter = {
                    ...state.character,
                    level: newLevel,
                    skillPointsRemaining:
                        newLevel -
                        (state.character.level -
                            state.character.skillPointsRemaining),
                }
                newState = {
                    ...state,
                    buildDataBase64: encodeBuildData(
                        mergedCharacter,
                        state.skills
                    ),
                    character: mergedCharacter,
                }
                break
            case 'learnSkill':
                mergedCharacter = {
                    ...state.character,
                    skillPointsRemaining:
                        state.character.skillPointsRemaining -
                        action.payload.skillPointCost,
                    learnedSkills: [
                        ...state.character.learnedSkills,
                        action.payload.id,
                    ],
                }
                newState = {
                    ...state,
                    buildDataBase64: encodeBuildData(
                        mergedCharacter,
                        state.skills
                    ),
                    character: mergedCharacter,
                }
                break
            case 'unlearnSkill':
                const learnedSkillIndex =
                    state.character.learnedSkills.findIndex(
                        (ls) => ls === action.payload.id
                    )
                let modifiedLearnedSkills = [...state.character.learnedSkills]
                modifiedLearnedSkills.splice(learnedSkillIndex, 1)
                mergedCharacter = {
                    ...state.character,
                    skillPointsRemaining:
                        state.character.skillPointsRemaining +
                        action.payload.skillPointCost,
                    learnedSkills: modifiedLearnedSkills,
                }
                newState = {
                    ...state,
                    buildDataBase64: encodeBuildData(
                        mergedCharacter,
                        state.skills
                    ),
                    character: mergedCharacter,
                }
                break
            case 'loadBuildData':
                mergedCharacter = {
                    ...state.character,
                    ...action.payload.character,
                    likes: action.payload.character.likedBy?.length || 0,
                    likedBy: new Set(action.payload.character.likedBy || []),
                }
                const modal = action.payload.partialLoadFailure
                    ? {
                          ...action.payload.partialLoadFailure,
                          open: true,
                      }
                    : {}
                newState = {
                    ...state,
                    buildDataBase64: action.payload.buildDataBase64,
                    buildId: action.payload.buildId,
                    modal,
                    character: {
                        ...mergedCharacter,
                        skillPointsRemaining: calculateSkillPointsRemaining(
                            mergedCharacter.learnedSkills,
                            mergedCharacter.level,
                            state.skills
                        ),
                    },
                    createdBy: action.payload.createdBy,
                    createdAt: action.payload.createdAt,
                    updatedBy: action.payload.updatedBy,
                    updatedAt: action.payload.updatedAt,
                }
                break
            case 'setBuildId':
                newState = {
                    ...state,
                    buildId: action.payload,
                }
                break
            case 'resetBuild':
                newState = {
                    ...initialState,
                }
                break
            case 'setAttribute':
                newState = {
                    ...state,
                    character: {
                        ...state.character,
                        attributes: {
                            ...state.character.attributes,
                            [action.payload.attr]: action.payload.value,
                        },
                    },
                }
                break
            case 'setWeaponDamage':
                newState = {
                    ...state,
                    character: {
                        ...state.character,
                        equipment: {
                            ...state.character.equipment,
                            weaponDamage: action.payload,
                        },
                    },
                }
                break
            case 'closeModal':
                newState = {
                    ...state,
                    modal: {
                        open: false,
                    },
                }
                break
            case 'setBuilds':
                newState = {
                    ...state,
                    builds: action.payload.map((b) => ({
                        ...b,
                        likedBy: new Set(b.likedBy || []),
                        likes: b.likedBy?.length,
                    })),
                }
                break
            case 'setUser':
                newState = {
                    ...state,
                    user: action.payload,
                }
                break
            case 'optimisticLike':
                newState = {
                    ...state,
                }
                if (newState.buildId === action.payload.buildId) {
                    newState.character.likedBy.add(action.payload.userId)
                    newState.character.likes++
                }
                build = newState.builds.find(
                    (b) => b.id === action.payload.buildId
                )
                if (build) {
                    build.likedBy.add(action.payload.userId)
                    build.likes++
                }
                break
            case 'optimisticUnlike':
                newState = {
                    ...state,
                }
                if (newState.buildId === action.payload.buildId) {
                    newState.character.likedBy.delete(action.payload.userId)
                    newState.character.likes--
                }
                build = newState.builds.find(
                    (b) => b.id === action.payload.buildId
                )
                if (build) {
                    build.likedBy.delete(action.payload.userId)
                    build.likes--
                }
                break
            default:
                throw new Error('Unknown Action Dispatched to Store')
        }
        console.log('Store Update', action, newState)
        return newState
    }, initialState)

    return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export const useDispatch = () => {
    const globalState = useContext(store)
    const { dispatch } = globalState
    return dispatch
}

export const useAppState = () => {
    const globalState = useContext(store)
    const { state } = globalState
    return state
}
