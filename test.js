const Promise = require('promise');
const fs = require('fs');

const readFile = Promise.denodeify(fs.readFile);


module.exports = {
    readJSONFile: (jsonFile) => {
        return readFile(jsonFile, 'utf8').then((response) => {
            return JSON.parse(response);
        })

    }
}
