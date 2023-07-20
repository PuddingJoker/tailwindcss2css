let obj = {}

const trs = document.getElementsByTagName("tr");

for (let i = 0; i < trs.length; i++) {
    const tds = trs[i].getElementsByTagName('td');
    obj[tds[0].textContent] = tds[1].textContent.split(";").join(";\n");
}

console.log(JSON.stringify(obj));

