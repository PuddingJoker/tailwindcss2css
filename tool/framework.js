const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');
const { tailwindToCss, originClasses } = require("./index");

const importReg = /(import[^]*?\r?\n[\r\n]+)(?!import\b)/;

function updateCSSProperty(str) {
  const properties = str.split(';');

  for (let i = 0; i < properties.length; i++) {
    let property = properties[i].trim();
    const [key, value] = property.split(':').map(item => item.trim());

    if (key) {
      const updatedKey = key
        .split('-')
        .map((part, index) => (index > 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
        .join('');

      properties[i] = `${updatedKey}: ${value}`
    }
  }

  return properties.join('; ');
}

const JsxConvert = (path = "", way) => {
  let css = "";
  let count = 1;
  try {
    let content = fs.readFileSync(path, "utf8");
    content = content.replace(/className="(.*?)"/g, (_, b) => {
      if (way === "native") {
        css += `.tailwindToCss${count}{
                    ${tailwindToCss(b)}
                }`;
        const classes = `className={\`$\{styles.tailwindToCss${count}\} ${Array.from(
          originClasses
        ).join(" ")}\`}`;
        count++;
        return classes;
      }

      if (way === "cssinjs") {
        css += `
                    const div${count} = css\`\n${tailwindToCss(b)} \`
                `;
        const classes = `className={\`$\{div${count}\} ${Array.from(
          originClasses
        ).join(" ")}\`}`;
        count++;
        return classes;
      }

      if (way === "inline") {
        let style = updateCSSProperty(tailwindToCss(b))

        style = `style={{${style}}}`
          .replace(/(\w+):\s*([^;]+)/g, '$1: "$2"')
          .replace(/;/g, ",");

        const classes = originClasses.size
          ? `className="${Array.from(originClasses).join(" ")}"`
          : "";
        return style + classes;
      }
    });

    if (way === "inline") {
      // fs.writeFileSync(path, content, "utf8");
      console.log(path, "     change to inline style success!");
    }
    if (way === "native") {
      // generate .css file
      let generatePath = path.split("/");
      const fileName = generatePath.pop().split(".")[0].toLowerCase();
      generatePath = `${generatePath.join("/")}/${fileName}.module.css`;
      fs.writeFileSync(generatePath, css, "utf8");

      // write origin file
      const codeToInsert = `
                import styles from "./${fileName}.module.css";
            `;
      content = importReg.test(content) ? content.replace(importReg, `$1${codeToInsert}`) : codeToInsert + content;
      fs.writeFileSync(path, content, "utf8");
      console.log(generatePath, "    generate style file success!");
    }

    if (way === "cssinjs") {
      const codeToInsert = `
                import { css } from "@linaria/core";
                ${css}
            `;
      content = importReg.test(content) ? content.replace(importReg, `$1${codeToInsert}`) : codeToInsert + content;
      fs.writeFileSync(path, content, "utf8");
      console.log(path, "     change into cssinjs success!");
    }
  } catch (error) {
    console.log(error);
  }
};

const VueConvert = (path = "", way) => {
  let css = "";
  let count = 1;
  try {
    let content = fs.readFileSync(path, "utf8");
    content = content.replace(/class="(.*?)"/g, (_, b) => {
      if (way === "native") {
        const hasBackTick = b.includes("`");
        if (hasBackTick) {
          console.warn(`——————————————————————————————————————————compile fail while class got backtick:\n${b}\n
                                    ——————————————————————————————————————————`);
          return _;
        }
        css += `.tailwindToCss${count}{
                    ${tailwindToCss(b)}
                }`;
        const classes = `class="tailwindToCss${count} ${Array.from(
          originClasses
        ).join(" ")}"`;
        count++;
        return classes;
      }

      if (way === "cssinjs") {
        css += `
                    const div${count} = css\`\n${tailwindToCss(b)} \`
                `;
        const classes = `:class="div${count}"`;
        count++;
        return classes;
      }

      if (way === "inline") {
        const hasBackTick = b.includes("`");
        if (hasBackTick) {
          console.warn(`——————————————————————————————————————————compile fail while class got backtick:\n${b}\n
                                    ——————————————————————————————————————————`);
          return _;
        }

        const styles = `style="${tailwindToCss(b)}"`

        const classes = originClasses.size
          ? `class="${Array.from(originClasses).join(" ")}"`
          : "";
        return styles + classes;
      }
    });

    if (way === "inline") {
      fs.writeFileSync(path, content, "utf8");
      console.log(path, "     change to inline style success!");
    }
    if (way === "native") {
      const styleReg = /<style\s*scoped>([\s\S]*?)<\/style>/;
      const matches = content.match(styleReg);

      let codeToInsert;

      if (matches) {
        const originStyle = matches[1];
        codeToInsert = `
            <style scoped>
            ${originStyle}
                ${css}
            </style>
            `;
        content = content.replace(styleReg, codeToInsert);
      } else {
        codeToInsert = `
            <style scoped>
                ${css}
            </style>
            `;
        content = content + codeToInsert;
      }
      fs.writeFileSync(path, content, "utf8");
      console.log(path, "    generate style codes success!");
    }

    if (way === "cssinjs") {
      console.log("vue framework cssinjs is not available now ~~~~~~~~~~~~~~~");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {*} dir   entry,must be a absolute path
 * @param {*} VueOrJsx  project framework:  "vue"  "react"
 * @param {*} way  compile way: "inline"  "native"  "cssinjs"
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
      // filter
      const ends = [".vue", ".jsx", ".tsx"];
      if (!ends.includes(path.extname(file))) return;

      const fullPath = `${dir}/${file}`;
      if (VueOrReact === "react") JsxConvert(fullPath, way);
      if (VueOrReact === "vue") VueConvert(fullPath, way);
    });

    exec(`prettier --write '${dir}/**/*.{tsx,jsx,css,vue}'`, (error, stdout, stderr) => {
      if (error) {
        console.log(`\n~~~~~~~~~~~~~~~~  remember to run "npm install -g prettier" first ~~~~~~~~~~~~~~~~\n `);
        console.error(`format file fail: ${error}`);
        return;
      }

      console.log(`format file success!\n ${stdout}`);
      stderr && console.error(`format file fail: ${stderr}`);
    });

  } catch (error) {
    console.log(error);
  }
};

module.exports = run;

