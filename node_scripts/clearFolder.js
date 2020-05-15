/* eslint-disable */
const fs = require('fs');

const folder = process.argv[2];

if(!fs.existsSync(folder)){
    console.log(`${folder} does not exist`);
}

try{
    let files = fs.readdirSync(folder);

    files.forEach( file => {
        let filePath = `${folder}\\${file}`;
        fs.unlinkSync(filePath);
        console.log(`Deleted ${filePath}.`)    ;
    })

}catch(e) {
    console.log(e.message);
}