import React, { createContext, useReducer } from 'react'

const initialState = {
    skills: null,
}

export const store = createContext(initialState)
const { Provider } = store

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        let newState
        switch (action.type) {
            case 'setSkills':
                newState = {
                    ...state,
                    skills: action.payload,
                }
                break
            default:
                throw new Error()
        }
        console.log('Store Update', action, newState)
        return newState
    }, initialState)

    return <Provider value={{ state, dispatch }}>{children}</Provider>
}
