const ExcelDb = nodeRequire('./libs/excel-db.js');
const _ = nodeRequire('lodash');
const db = new ExcelDb('details');

let cache = {};
module.exports = function() {
    return new Promise((resolve, reject)=>{

        if (cache.grouped) {
            resolve(cache.grouped);
        } else {
            db.open()
            .then((tables)=>{
                let details = _.slice(tables[0], 1);
                let grouped = _.groupBy(details, 'A');

                cache['grouped'] = grouped;
                resolve(grouped);
            })
            .catch(reject);
        }
    })
}
