
 // 邮箱的合法性----正则
// 邮箱的合法性----正则 test 返回只是 true/false .match返回是数组，用于快速把使用正则表达式去把某个字符串中想要的部分快速抓取出来。
// aaabbbccc ---/xxxx/.match("aaabbbccc")===["aaa","bbb","cccc"]
export const isEmail = (val) => {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
}

export const isNumber = (val) => {
    return /^\d*$/.test(val)
}

const validator = {
    isEmail,
    isNumber
}

export default validator