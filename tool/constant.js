const tailwindClass = {
    pt: "padding-top",
    pb: "padding-bottom",
    pl: "padding-left",
    pr: "padding-right",
    p: "padding",
    mb: "margin-bottom",
    m: "margin",
    mt: "margin-top",
    ml: "margin-left",
    mr: "margin-right",
    w: "width",
    h: "height",
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
    bg: "background",
    text: "color",
    aspect: "aspect-ratio",
    color: "color",
    "max-w": "max-width",
    "min-w": "min-width",
    "min-h": "min-height",
    "max-h": "max-height",
    leading: "line-height",
    rounded: "border-radius",
};

const specialClass = {
    px: "padding-left:{{var}};\npadding-right:{{var}};\n",
    py: "padding-top:{{var}};\npadding-bottom:{{var}};\n",
    mx: "margin-left:{{var}};\nmargin-right:{{var}};\n",
    my: "margin-top:{{var}};\nmargin-bottom:{{var}};\n",
    border: "border:{{var}} solid;\n",
};

const specialReg = {
    // text-[18px]  text-[1rem] text-[0.5em] ....
    "^text-\\[((\\d+(\\.\\d+)?)(px|rem|em))\\]$": "font-size:{{var}};\n",
};

const nativeClassHelper = ["hover:","sm:","md:","lg:","xl:","2xl:"]


module.exports = {
    tailwindClass,
    specialClass,
    specialReg
}