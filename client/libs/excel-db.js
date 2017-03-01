const fs = nodeRequire('fs');
const path = nodeRequire('path');
const xlsx2json = nodeRequire('xlsx2json');

module.exports = class ExcelDb {
    constructor(dbName) {
        var dir = path.join(__dirname, '../data/', dbName);

        if (fs.existsSync(dir+'.xls')) {
            this.connection = dir + '.xls';
        } else {
            this.connection = dir + '.xlsx';
        }
    }

    open () {
        return new Promise((resolve, reject) => {
            if (this.tables) {
                resolve(this.tables);
            } else {
                if (fs.existsSync(this.connection)) {
                    return xlsx2json(this.connection).then(jsonArray => {
                        this.tables = jsonArray;
                        resolve(jsonArray);
                    });
                } else {
                    reject('excel: "'+ this.connection +'" is not esists.');
                }
            }
        });
    }
}
