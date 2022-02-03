import React, { createContext, useReducer, useContext } from 'react'
import skills from './data/skills.json'
import fire from './data/skills/fire.json'
import warrior from './data/skills/warrior.json'

const getSkills = (skillTree) => skills.filter((s) => s.skillTree === skillTree)

const initialState = {
    character: {
        name: '',
        level: 30,
        skillPointsRemaining: 30,
        learnedSkills: [],
    },
    skills: {
        fire,
        lightning: getSkills('lightning'),
        cold: getSkills('cold'),
        warrior,
    },
}

export const store = createContext(initialState)
const { Provider } = store

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        let newState
        switch (action.type) {
            case 'setName':
                newState = {
                    ...state,
                    character: {
                        ...state.character,
                        name: action.payload,
                    },
                }
                break
            case 'setLevel':
                newState = {
                    ...state,
                    character: {
                        ...state.character,
                        level: action.payload,
                        skillPointsRemaining:
                            parseInt(action.payload, 10) -
                            (state.character.level -
                                state.character.skillPointsRemaining),
                    },
                }
                break
            case 'learnSkill':
                newState = {
                    ...state,
                    character: {
                        ...state.character,
                        skillPointsRemaining:
                            state.character.skillPointsRemaining -
                            action.payload.skillPointCost,
                        learnedSkills: [
                            ...state.character.learnedSkills,
                            action.payload.id,
                        ],
                    },
                }
                break
            case 'unlearnSkill':
                const learnedSkillIndex =
                    state.character.learnedSkills.findIndex(
                        (ls) => ls === action.payload.id
                    )
                let modifiedLearnedSkills = [...state.character.learnedSkills]
                modifiedLearnedSkills.splice(learnedSkillIndex, 1)
                newState = {
                    ...state,
                    character: {
                        ...state.character,
                        skillPointsRemaining:
                            state.character.skillPointsRemaining +
                            action.payload.skillPointCost,
                        learnedSkills: modifiedLearnedSkills,
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
