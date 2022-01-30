import React from 'react'
import styled from '@emotion/styled'
import { isNil } from 'lodash-es'

import effectsGlossary from '../../data/effectsGlossary.json'
import { replaceJSX } from '../../lib/helpers'
import Tooltip from '../../components/Tooltip'

const BORDER_WIDTH = 4

const Root = styled.div(({ theme, left, top }) => ({
    position: 'absolute',
    left,
    top,
}))

const Icon = styled.img(({ theme, grayscale }) => ({
    boxSizing: 'content-box',
    width: theme.sizing.skillIcon,
    height: theme.sizing.skillIcon,
    maxWidth: theme.sizing.skillIcon,
    maxHeight: theme.sizing.skillIcon,
    overflow: 'hidden',
    border: `${BORDER_WIDTH}px solid transparent`,
    '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.75)',
    },
    cursor: 'pointer',
    filter: grayscale && `grayscale(1)`,
}))

const TooltipContainer = styled.div(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    '&:not(:last-of-type)': {
        marginBottom: theme.spacing(1),
    },
}))

const HightlightText = styled.span(({ theme }) => ({
    color: theme.palette.text.highlight,
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
}) {
    let decoratedDescription = skill.description
    let glossaryItems = []

    for (let word in effectsGlossary) {
        if (decoratedDescription.includes(word)) {
            decoratedDescription = replaceJSX(
                decoratedDescription,
                new RegExp(word, 'g'),
                <HightlightText>{word}</HightlightText>
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
                                ) : (
                                    'Click To Learn'
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
                <Icon
                    src={`/skill-icons/${skill.id}.jpg`}
                    alt={`skill icon: ${skill.id}`}
                    grayscale={!isLearned}
                    onClick={handleClick}
                />
            </Tooltip>
        </Root>
    )
}
