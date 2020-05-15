const testReadFileJSON = require('./test');


testReadFileJSON.readJSONFile('./mockUser.json').then((jsonArray) => {
    console.log(jsonArray)
})