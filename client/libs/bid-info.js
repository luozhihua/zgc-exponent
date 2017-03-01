const ExcelDb = nodeRequire('./libs/excel-db.js');
const _ = nodeRequire('lodash');
const db = new ExcelDb('4 各商品中标信息');

let cache = {};

module.exports = function() {
    return new Promise((resolve, reject)=>{

        if (cache.grouped) {
            resolve(cache.grouped);
        } else {
            db.open()
            .then((tables)=>{

                let results = [];
                tables.forEach((table)=>{
                    results = results.concat(_.slice(table, 1));
                });
                let grouped = _.groupBy(results, 'A');

                cache['grouped'] = grouped;

                resolve(grouped);
            })
            .catch(reject);
        }
    })
}
