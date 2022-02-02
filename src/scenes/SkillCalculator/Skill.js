import React from 'react'
import styled from '@emotion/styled'
import { isNil } from 'lodash-es'

import effectsGlossary from '../../data/effectsGlossary.json'
import { replaceJSX } from '../../lib/helpers'
import { Tooltip, HightlightText, ErrorText } from '../../components'
import {
    SkillTreeIcon,
    SkillTreeIconImg,
    SkillTreeIconAnnotation,
} from './index'
import { ReactComponent as LockIconRaw } from '../../icons/lock.svg'

const Root = styled.div(({ theme, left, top }) => ({
    position: 'absolute',
    left,
    top,
}))

const SkillIcon = styled(SkillTreeIcon)(({ theme }) => ({
    width: theme.sizing.skillIcon,
    height: theme.sizing.skillIcon,
    maxWidth: theme.sizing.skillIcon,
    maxHeight: theme.sizing.skillIcon,
    cursor: 'pointer',
}))

const SkillIconImg = styled(SkillTreeIconImg)(({ theme, grayscale }) => ({
    filter: grayscale && `grayscale(1)`,
}))

const SkillIconAnnotation = styled(SkillTreeIconAnnotation)(({ theme }) => ({
    background: 'none',
}))

const SkillIconOverlay = styled.div(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(80, 80, 80, 0.5)',
}))

const LockIcon = styled(LockIconRaw)(({ theme }) => ({
    height: 24,
    width: 24,
    fill: 'rgba(10, 10, 10, 0.75)',
}))

const TooltipContainer = styled.div(({ theme }) => ({
    width: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
}))

const Heading = styled.div(({ theme }) => ({
    marginBottom: theme.spacing(1),
}))

const Title = styled.div(({ theme }) => ({
    color: theme.palette.text.highlight,
}))

const Content = styled.div(({ theme }) => ({}))

const Section = styled.div(({ theme }) => ({
    width: '100%',
    '&:not(:last-of-type)': {
        marginBottom: theme.spacing(1),
    },
}))

const GlossaryItemTitle = styled.div(({ theme }) => ({
    color: theme.palette.text.highlight,
    fontStyle: 'italic',
    fontWeight: 'bold',
}))

const GlossaryItemDescription = styled.div(({ theme }) => ({
    color: theme.palette.text.highlight,
}))

export default function Skill({
    skill,
    left = 0,
    top = 0,
    toggleSkill,
    isLearned,
    hasRequirement,
    learnability,
}) {
    // right now skills that require/replace other skills have the same icon
    const iconUrl = `/skill-icons/${skill.skillTree}/${
        skill.requires || skill.id
    }.png`

    let decoratedDescription = skill.description
    let glossaryItems = []

    for (let word in effectsGlossary) {
        if (decoratedDescription.includes(word)) {
            decoratedDescription = replaceJSX(
                decoratedDescription,
                new RegExp(word, 'g'),
                <HightlightText key={word}>{word}</HightlightText>
            )

            glossaryItems.push({
                title: word,
                description: effectsGlossary[word],
            })
        }
    }

    const getDurationText = (duration) => {
        return `${duration} turn${duration > 1 ? 's' : ''}`
    }

    const getRangeText = (range) => {
        switch (range) {
            case -1:
                return 'Special'
            case 0:
                return 'Self'
            case 1:
                return 'Melee'
            default:
                return range
        }
    }

    const handleClick = (event) => {
        toggleSkill(skill)
    }

    return (
        <Root left={left} top={top}>
            <Tooltip
                content={
                    <TooltipContainer>
                        <Heading>
                            <Title>{skill.title}</Title>
                        </Heading>
                        <Content>
                            <Section>
                                {isLearned ? (
                                    <HightlightText>Learned</HightlightText>
                                ) : learnability.canLearn ? (
                                    'Click To Learn'
                                ) : (
                                    <ErrorText>{learnability.reason}</ErrorText>
                                )}
                            </Section>
                            <Section>{decoratedDescription}</Section>
                            {skill.replaces && (
                                <Section>
                                    Replaces{' '}
                                    <HightlightText>
                                        {skill.replaces}
                                    </HightlightText>
                                </Section>
                            )}
                            {skill.type === 'active' && (
                                <Section>
                                    {!isNil(skill.actionPointCost) && (
                                        <div>
                                            AP Cost:{' '}
                                            {skill.actionPointCost || 'None'}
                                        </div>
                                    )}
                                    {!isNil(skill.duration) && (
                                        <div>
                                            Duration:{' '}
                                            {getDurationText(skill.duration)}
                                        </div>
                                    )}
                                    {!isNil(skill.range) && (
                                        <div>
                                            Range: {getRangeText(skill.range)}
                                        </div>
                                    )}
                                    {!isNil(skill.blastRadius) && (
                                        <div>
                                            Range: {getRangeText(skill.range)}
                                        </div>
                                    )}
                                    {!isNil(skill.manaCost) && (
                                        <div>Mana Cost: {skill.manaCost}</div>
                                    )}
                                    {!isNil(skill.cooldown) && (
                                        <div>Cooldown: {skill.cooldown}</div>
                                    )}
                                </Section>
                            )}
                            {glossaryItems.map((item) => (
                                <Section key={item.title}>
                                    <GlossaryItemTitle>
                                        {item.title}
                                    </GlossaryItemTitle>
                                    <GlossaryItemDescription>
                                        {item.description}
                                    </GlossaryItemDescription>
                                </Section>
                            ))}
                        </Content>
                    </TooltipContainer>
                }
            >
                <SkillIcon onClick={handleClick}>
                    <SkillIconImg
                        src={iconUrl}
                        alt={skill.title}
                        grayscale={!isLearned}
                    />
                    {hasRequirement && (
                        <SkillIconAnnotation>I</SkillIconAnnotation>
                    )}
                    {skill.requires && (
                        <SkillIconAnnotation>II</SkillIconAnnotation>
                    )}
                    {!isLearned && (
                        <SkillIconOverlay>
                            <LockIcon />
                        </SkillIconOverlay>
                    )}
                </SkillIcon>
            </Tooltip>
        </Root>
    )
}
