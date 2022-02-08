import React from 'react'
import styled from '@emotion/styled'
import { capitalize, isNil } from 'lodash-es'

import effectsGlossary from '../../data/effectsGlossary.json'
import { Tooltip, HightlightText, ErrorText } from '../../components'
import {
    SkillTreeIcon,
    SkillTreeIconImg,
    SkillTreeIconAnnotation,
} from './index'
import { ReactComponent as LockIconRaw } from '../../icons/lock.svg'

const damageTypeEffects = {
    fire: 'Heat',
    lightning: 'Shocked',
    cold: 'Chilled',
}

const Root = styled.div(({ theme, left, right, top }) => ({
    position: 'absolute',
    left,
    right,
    top,
}))

const SkillIcon = styled(SkillTreeIcon)(({ theme }) => ({
    width: theme.sizing.skillIcon,
    height: theme.sizing.skillIcon,
    maxWidth: theme.sizing.skillIcon,
    maxHeight: theme.sizing.skillIcon,
    cursor: 'pointer',
}))

const SkillIconBorder = styled.div(({ theme }) => ({
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: `3px outset ${theme.palette.skillBorder}`,
    '&:before': {
        content: '""',
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        border: '1px solid rgba(195, 153, 133, 0.3)',
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        top: 2,
        left: 2,
        right: 2,
        bottom: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.3)',
    },
}))

const SkillIconImg = styled(SkillTreeIconImg)(({ theme, grayscale }) => ({
    filter: grayscale && `grayscale(1)`,
}))

const SkillIconAnnotation = styled(SkillTreeIconAnnotation)(({ theme }) => ({
    top: 'auto',
    bottom: 2,
    background: 'none',
    border: 'none',
    fontSize: '14px',
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

const SkillConnectorStraight = styled.div(({ theme }) => {
    const height = theme.spacing(3)
    return {
        position: 'absolute',
        width: 4,
        height: height,
        top: -height,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: theme.palette.primary,
    }
})

const SkillConnectorToLeft = styled.div(({ theme }) => {
    const height = theme.spacing(4)
    return {
        position: 'absolute',
        width: 4,
        height: height,
        top: -height + 4,
        left: '50%',
        transform: 'translateX(-20px) rotate(-30deg)',
        backgroundColor: theme.palette.primary,
    }
})
const SkillConnectorToRight = styled(SkillConnectorToLeft)(({ theme }) => ({
    transform: 'translateX(20px) rotate(30deg)',
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

const checkValue = (value) => {
    return value !== '' && !isNil(value)
}

export default function Skill({
    skill,
    pos,
    toggleSkill,
    isLearned,
    hasRequirement,
    learnability,
    replaces,
    isOnlyChild,
    isLeftSibling,
    isRightSibling,
}) {
    const iconName = `${capitalize(skill.skillTree)} T${skill.tier},${
        skill.skillNum
    } ${skill.title} Icon`
    const iconUrl = `skill-icons/${skill.skillTree}/${iconName}.png`

    let decoratedDescriptionWords = skill.description.split(' ')
    let glossaryItems = []
    let damageEffectDescription

    decoratedDescriptionWords = decoratedDescriptionWords.map((word) => {
        const isLastWordInSentence = word.endsWith('.')
        if (isLastWordInSentence) {
            word = word.replace('.', '')
        }
        if (effectsGlossary[word]) {
            glossaryItems.push({
                title: word,
                description: effectsGlossary[word],
            })
            return (
                <>
                    <HightlightText>{word}</HightlightText>
                    {isLastWordInSentence ? '. ' : ' '}
                </>
            )
        }
        if (typeof word === 'string') {
            return `${word}${isLastWordInSentence ? '. ' : ' '}`
        }
        return word
    })

    if (checkValue(skill.damageType)) {
        const word = damageTypeEffects[skill.damageType]
        if (!glossaryItems.find((x) => x.title === word)) {
            glossaryItems.push({
                title: word,
                description: effectsGlossary[word],
            })
        }
        damageEffectDescription = (
            <>
                All {skill.damageType} damage applies{' '}
                <HightlightText>{word}</HightlightText>.
            </>
        )
    }

    const getDurationText = (duration) => {
        return typeof duration === 'number'
            ? `${duration} turn${duration > 1 ? 's' : ''}`
            : duration
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
        <Root left={pos.left} right={pos.right} top={pos.top}>
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
                            <Section>
                                <HightlightText>
                                    Skill Point Cost: {skill.skillPointCost}
                                </HightlightText>
                            </Section>
                            <Section>{decoratedDescriptionWords}</Section>
                            <Section>{damageEffectDescription}</Section>
                            {replaces && (
                                <Section>
                                    Replaces{' '}
                                    <HightlightText>
                                        {replaces.title}
                                    </HightlightText>
                                </Section>
                            )}
                            {skill.type === 'active' && (
                                <Section>
                                    {checkValue(skill.actionPointCost) && (
                                        <div>
                                            AP Cost:{' '}
                                            {skill.actionPointCost || 'None'}
                                        </div>
                                    )}
                                    {checkValue(skill.duration) && (
                                        <div>
                                            Duration:{' '}
                                            {getDurationText(skill.duration)}
                                        </div>
                                    )}
                                    {checkValue(skill.range) && (
                                        <div>
                                            Range: {getRangeText(skill.range)}
                                        </div>
                                    )}
                                    {checkValue(skill.blastRadius) && (
                                        <div>
                                            Blast Radius:{' '}
                                            {getRangeText(skill.blastRadius)}
                                        </div>
                                    )}
                                    {checkValue(skill.manaCost) && (
                                        <div>
                                            Mana Cost (base): {skill.manaCost}
                                        </div>
                                    )}
                                    {checkValue(skill.cooldown) && (
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
                    <SkillIconBorder />
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
            {isOnlyChild && <SkillConnectorStraight />}
            {isLeftSibling && <SkillConnectorToRight />}
            {isRightSibling && <SkillConnectorToLeft />}
        </Root>
    )
}
