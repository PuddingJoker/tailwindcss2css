const tailwindMap = require("./tailwindMap");
const { tailwindClass, specialClass, specialReg, originClassHelper } = require("./constant")

let originClasses = new Set()

const convertToCss = classNames => {
    let cssCode = ``;
    tailwindMap.forEach(element => {
        element.content.forEach(content => {
            content.table.forEach(list => {
                if (classNames?.includes(list[0])) {
                    cssCode += `${list[1]} \n`;
                    originClasses.delete(list[0]);
                }

                if (classNames?.includes(list[1])) {
                    const semicolon = list[2][list[2].length - 1] !== ";" ? ";" : "";
                    cssCode += `${list[2]}${semicolon} \n`;
                    originClasses.delete(list[1]);
                }
            });
        });
    });

    const arbitraryClasses = classNames?.filter(className =>
        className.includes("[")
    );

    let combineCss = {};
    arbitraryClasses?.forEach(className => {
        try {
            const inputClass = className?.split("-[")[0].replace(".", "");
            const inputVal = className?.match(/(?<=\[)[^\][]*(?=])/g)[0];
            // special class
            if (specialClass[inputClass]) {
                originClasses.delete(className);
                if (!combineCss[inputClass]) {
                    combineCss[inputClass] = inputVal;
                } else {
                    combineCss[inputClass] = combineCss[inputClass] + " " + inputVal;
                }
                return;
            }

            // special reg
            for (let key in specialReg) {
                if (new RegExp(key).test(className)) {
                    originClasses.delete(className);
                    const css = specialReg[key].replace(/{{(.*?)}}/g, () => {
                        return inputVal;
                    });
                    cssCode += css;
                    return;
                }
            }

            // common tailwindcss
            if (tailwindClass[inputClass]) {
                originClasses.delete(className);
                cssCode += `${tailwindClass[inputClass]}: ${inputVal};\n`;
                return;
            }

        } catch (e) {
            console.log(e);
        }
    });

    for (let key in combineCss) {
        if (specialClass[key]) {
            const css = specialClass[key].replace(/{{(.*?)}}/g, () => {
                return combineCss[key.trim()];
            });
            cssCode += css;
        }
    }
    return cssCode;
};

const wrapReg = /\n/g;
const getBreakPoints = (input, breakpoint) => {
    return input
        .replace(wrapReg, " ")
        .split(" ")
        .filter(i => i.startsWith(breakpoint + ":"))
        .map(i => i.substring(3));
};

const getHoverClass = (input, classes) => {
    classes = classes.filter(i => i.startsWith("hover:"))
    return input
        .replace(wrapReg, " ")
        .split(" ")
        .filter(i => i.startsWith("hover:"))
        .map(i => i.replace("hover:", ""));
};

const tailwindToCss = input => {
    if (input === "") return "";

    const classNames = input
        .split(/\s+/)
        .map(i => i.trim())
        .filter(i => i !== "");
    const breakpoints = tailwindMap[0].content[1].table;

    const hoverClasses = getHoverClass(input, classNames);


    const smClasses = getBreakPoints(input, "sm");
    const mdClasses = getBreakPoints(input, "md");
    const lgClasses = getBreakPoints(input, "lg");
    const xlClasses = getBreakPoints(input, "xl");
    const _2xlClasses = getBreakPoints(input, "2xl");

    originClasses.size !== 0 && originClasses.clear()
    classNames.filter(i => {
        let left = ""
        if (i.includes(":")) {
            left = i.split(":")[0]
        }

        if (!left && !originClassHelper.includes(left)) {
            originClasses.add(i)
        }
    })

    let resultCss = `${convertToCss(classNames)}
    ${smClasses && smClasses.length
            ? breakpoints[0][1].replace("...", "\n  " + convertToCss(smClasses))
            : ""
        }
    ${mdClasses && mdClasses.length
            ? breakpoints[1][1].replace("...", "\n  " + convertToCss(mdClasses))
            : ""
        }
    ${lgClasses && lgClasses.length
            ? breakpoints[2][1].replace("...", "\n  " + convertToCss(lgClasses))
            : ""
        }
    ${xlClasses && xlClasses.length
            ? breakpoints[3][1].replace("...", "\n  " + convertToCss(xlClasses))
            : ""
        }
    ${_2xlClasses && _2xlClasses.length
            ? breakpoints[4][1].replace("...", "\n  " + convertToCss(_2xlClasses))
            : ""
        }
    ${hoverClasses && hoverClasses.length
            ? `&:hover {\n ${convertToCss(hoverClasses)} }`
            : ""
        }
    `;

    return resultCss;
};



module.exports = {
    tailwindToCss,
    originClasses
};
