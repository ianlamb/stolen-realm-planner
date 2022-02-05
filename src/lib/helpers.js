import React from 'react'

export const replaceJSX = (str, find, replace) => {
    const parts = str.split(find)
    return parts.reduce((acc, val, i) => {
        acc.push(val)
        if (i < parts.length - 1) {
            acc.push(<React.Fragment key={i}>{replace}</React.Fragment>)
        }
        return acc
    }, [])
}
