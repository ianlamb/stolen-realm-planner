import React from 'react'

export const replaceJSX = (str, find, replace, key) => {
    let parts = str.split(find)
    return parts.reduce((acc, val, i) => {
        acc.push(val)
        if (i < parts.length - 1) {
            acc.push(<React.Fragment key={key + i}>{replace}</React.Fragment>)
        }
        return acc
    }, [])
}

// only replaces the first instance found
// expects the `find` regexp to be use a group around the whole search
export const replaceJSXSpecial = (str, find, replace) => {
    let parts = str.split(find)
    if (parts.length > 2) {
        // clear out the match group
        parts.splice(1, 1)
    }
    if (parts.length > 2) {
        // more than 1 match so join the extra parts together
        const extraParts = parts.splice(1)
        parts.push(extraParts.join(''))
    }
    return parts.reduce((acc, val, i) => {
        acc.push(val)
        if (i < parts.length - 1) {
            acc.push(replace)
        }
        return acc
    }, [])
}
