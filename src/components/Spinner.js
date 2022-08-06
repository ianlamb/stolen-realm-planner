import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/css'

const ellipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`
const ellipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`
const ellipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`

const spinner = css`
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;

    & div {
        position: absolute;
        top: 33px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: #fff;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    & div:nth-child(1) {
        left: 8px;
        animation: ${ellipsis1} 0.6s infinite;
    }
    & div:nth-child(2) {
        left: 8px;
        animation: ${ellipsis2} 0.6s infinite;
    }
    & div:nth-child(3) {
        left: 32px;
        animation: ${ellipsis2} 0.6s infinite;
    }
    & div:nth-child(4) {
        left: 56px;
        animation: ${ellipsis3} 0.6s infinite;
    }
`

const Root = styled.div(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
}))

export const Spinner = () => {
    return (
        <Root>
            <div className={spinner}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Root>
    )
}
