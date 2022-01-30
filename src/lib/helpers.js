export const replaceJSX = (str, find, replace) => {
    const parts = str.split(find)
    return parts.reduce((acc, val, i) => {
        acc.push(val)
        if (i < parts.length - 1) {
            acc.push(replace)
        }
        return acc
    }, [])
}
