import React, { createContext, useReducer, useContext } from 'react'
import fire from './data/skills/fire.json'
import warrior from './data/skills/warrior.json'

const initialState = {
    character: {
        level: 30,
        skillPointsRemaining: 30,
        learnedSkills: [],
    },
    skills: {
        fire,
        warrior,
    },
}

export const store = createContext(initialState)
const { Provider } = store

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        let newState
        switch (action.type) {
            case 'learnSkill':
                console.log('Learned Skill', action.payload.id)
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
                let deletedElements = modifiedLearnedSkills.splice(
                    learnedSkillIndex,
                    1
                )
                console.log('Unlearned Skill', deletedElements)
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
