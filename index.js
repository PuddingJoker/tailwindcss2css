const tailwindToCss = require("./tool");

const pure = tailwindToCss(`w-[1180px] px-[15px] hover:text-[red] text-[18px] text-[0.3rem] 
text-[#808082] mx-auto py-[10px] mx-[10px] my-[20px] 
border-[1px] border-[black]  flex items-center justify-between h-[64px] md:mx-auto`)

// console.log(pure);



const run = require("./tool/framework")
/**
 *
 * @param {*} dir   entry,must be a absolute path
 * @param {*} isVueOrReact  project framework:  "vue"  "react"  " "
 * @param {*} way  compile way: "inline"  "pure"  "cssinjs" " "   cssinjs only support linaria
 */

run("/Users/pudding/Desktop/tailwind2css/src", "react", "inline");


