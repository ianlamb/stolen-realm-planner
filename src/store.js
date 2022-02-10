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
    buildDataBase64: null,
    character: {
        name: '',
        level: DEFAULT_LEVEL,
        skillPointsRemaining: getMaxSkillPoints(DEFAULT_LEVEL),
        learnedSkills: [],
        attributes: {
            // McTesta
            // might: 16,
            // dexterity: 8,
            // vitality: 14,
            // intelligence: 8,
            // reflex: 11,

            // Dana
            might: 53,
            dexterity: 63,
            vitality: 38,
            intelligence: 8,
            reflex: 13,
        },
        weaponAverage: 83.5,
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
    },
}

export const store = createContext(initialState)
const { Provider } = store

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        let newState
        let mergedCharacter
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
                }
                newState = {
                    ...state,
                    buildDataBase64: action.payload.buildDataBase64,
                    character: {
                        ...mergedCharacter,
                        skillPointsRemaining: calculateSkillPointsRemaining(
                            mergedCharacter,
                            state.skills
                        ),
                    },
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
