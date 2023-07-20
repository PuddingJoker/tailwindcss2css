const tailwindMap = require("./tailwindMap");
const { tailwindClass, specialClass, specialReg, originClassHelper, reactiveClass } = require("./constant")

let originClasses = new Set()

const convertToCss = classNames => {
    let cssCode = ``;

    classNames.map(className => {
        const val = tailwindMap[className]
        if (val) {
            cssCode += `${val} \n`;
            originClasses.delete(className);
        }
    })

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
            ? reactiveClass[0][1].replace("...", "\n  " + convertToCss(smClasses))
            : ""
        }
    ${mdClasses && mdClasses.length
            ? reactiveClass[1][1].replace("...", "\n  " + convertToCss(mdClasses))
            : ""
        }
    ${lgClasses && lgClasses.length
            ? reactiveClass[2][1].replace("...", "\n  " + convertToCss(lgClasses))
            : ""
        }
    ${xlClasses && xlClasses.length
            ? reactiveClass[3][1].replace("...", "\n  " + convertToCss(xlClasses))
            : ""
        }
    ${_2xlClasses && _2xlClasses.length
            ? reactiveClass[4][1].replace("...", "\n  " + convertToCss(_2xlClasses))
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
