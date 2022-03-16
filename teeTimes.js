const teeTimes = require('./teeTimesNew')
const copper = require('./teeTimesCopper.json')
const fs = require('fs');


const finalTeeTiems = [...teeTimes, ...copper];

fs.writeFile("combined.json", JSON.stringify(finalTeeTiems), "utf-8", function(){
    console.log('done')
})
