const { tailwindToCss, originClasses } = require("./tool");

const nativeCss = tailwindToCss(`w-[1180px] hello yourClasses px-[15px] hover:text-[red] text-[18px] text-[0.3rem] 
text-[#808082] mx-auto py-[10px] mx-[10px] my-[20px] 
border-[1px] border-[black]  flex items-center justify-between h-[64px] md:mx-auto`)

// console.log("originClasses: ", Array.from(originClasses));
// console.log("nativeCss: \n\n", nativeCss);


const run = require("./tool/framework")
/**
 *
 * @param {*} dir   entry, must be a absolute path
 * @param {*} VueOrJsx  project framework:  "vue"  "jsx", default "jsx"
 * @param {*} way  compile way: "inline"  "native"  "cssinjs" (only support linaria), default "inline"
 */

run("/Users/pudding/前端总学习/tailwind2css/src", "vue", "inline");


