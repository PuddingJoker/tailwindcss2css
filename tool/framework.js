const fs = require("fs");
const tailwindToCss = require("./index");

const importReg = /(import[^]*?\r?\n[\r\n]+)(?!import\b)/

const JsxConvert = (path = "", way) => {
    let css = ""
    let count = 1
    try {
        let content = fs.readFileSync(path, "utf8");
        content = content.replace(/className="(.*?)"/g, (_, b) => {
            if (way === "pure") {
                css += tailwindToCss(b)
                return 'className=""'
            }

            if (way === "cssinjs") {
                css += `
                    const div${count} = css\`\n${tailwindToCss(b)} \`
                `
                const classes = `className={div${count}}`
                count++
                return classes
            }

            if (way === "inline") {
                let style = tailwindToCss(b).replace(/-([a-z])/g, (a, p1) => {
                    return p1.toUpperCase();
                });
                style = `style={{${style}}}`
                    .replace(/(\w+):\s*([^;]+)/g, '$1: "$2"')
                    .replace(/;/g, ",");
                return style;
            }
        });


        if (way === "inline") {
            fs.writeFileSync(path, content, "utf8");
            console.log(path, "     change to inline style success!");
        }
        if (way === "pure") {
            content = `
                    .class{
                        ${css}
                    }
            `
            let generatePath = path.split("/");
            generatePath.pop()
            generatePath = `${generatePath.join("/")}/index.module.css`
            fs.writeFileSync(generatePath, content, "utf8");
            console.log(generatePath, "    generate style file success!");
        }

        if (way === 'cssinjs') {
            const codeToInsert = `
                import { css } from "@linaria/core";
                ${css}
            `
            content = content.replace(importReg, `$1${codeToInsert}`);
            fs.writeFileSync(path, content, "utf8");
            console.log(path, "     change into cssinjs success!");
        }

    } catch (error) {
        console.log(error);
    }
};

const VueConvert = (path = "", way) => {
    let css = ""
    let count = 1
    try {
        let content = fs.readFileSync(path, "utf8");
        content = content.replace(/class="(.*?)"/g, (_, b) => {
            if (way === "pure") {
                css += tailwindToCss(b)
                return 'class=""'
            }

            if (way === "cssinjs") {
                css += `
                    const div${count} = css\`\n${tailwindToCss(b)} \`
                `
                const classes = `:class="div${count}"`
                count++
                return classes
            }

            if (way === "inline") {
                return `style="${tailwindToCss(b)}"`
            }
        });


        if (way === "inline") {
            fs.writeFileSync(path, content, "utf8");
            console.log(path, "     change to inline style success!");
        }
        if (way === "pure") {
            content = `
                    .class{
                        ${css}
                    }
            `
            let generatePath = path.split("/");
            generatePath.pop()
            generatePath = `${generatePath.join("/")}/index.module.css`
            fs.writeFileSync(generatePath, content, "utf8");
            console.log(generatePath, "    generate style file success!");
        }

        if (way === 'cssinjs') {
            console.log("vue framework cssinjs is not available now ~~~~~~~~~~~~~~~");
            // const codeToInsert = `
            //     import { css } from "@linaria/core";
            //     ${css}
            // `
            // content = content.replace(importReg, `$1${codeToInsert}`);
            // fs.writeFileSync(path, content, "utf8");
            // console.log(path, "     change into cssinjs success!");
        }

    } catch (error) {
        console.log(error);
    }
}

/**
 *
 * @param {*} dir   entry,must be a absolute path
 * @param {*} isVueOrReact  project framework:  "vue"  "react" 
 * @param {*} way  compile way: "inline"  "pure"  "cssinjs"
 */

const run = (dir, VueOrReact = "react", way = "inline") => {
    try {
        const files = fs.readdirSync(dir);
        files.map(file => {
            const filePath = `${dir}/${file}`;
            // 判断是否为文件夹
            const stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                return run(filePath, VueOrReact, way);
            }
            const fullPath = `${dir}/${file}`;
            if (VueOrReact === "react") JsxConvert(fullPath, way);
            if (VueOrReact === "vue") VueConvert(fullPath, way);
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = run

