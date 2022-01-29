import { useContext } from 'react'
import Skill from './Skill'

export default function SkillTree({ type, title }) {
    return (
        <div>
            <h5>{title}</h5>
            <Skill />
        </div>
    )
}
