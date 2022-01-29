import { useContext } from 'react'
import { Outlet, Link } from 'react-router-dom'

import { store } from '../../store'

export function SkillCalculator({ skillTrees }) {
    const globalState = useContext(store)
    const { dispatch, state } = globalState
    const { skills } = state

    return (
        <div>
            <div>
                {skillTrees.map((skillTree) => (
                    <Link key={skillTree.id} to={skillTree.id}>
                        {skillTree.title}
                    </Link>
                ))}

                <Outlet />
            </div>
        </div>
    )
}
