import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export function SkillCalculator({ skillTrees }) {
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
