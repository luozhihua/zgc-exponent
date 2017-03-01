const ExcelDb = nodeRequire('./libs/excel-db.js');
const _ = nodeRequire('lodash');
const db = new ExcelDb('imgs');

let cache = {};

module.exports = function() {
    return new Promise((resolve, reject)=>{

        if (cache['imgs']) {
            resolve(cache['imgs']);
        } else {
            db.open()
            .then((tables)=>{

                let map = {};
                _.slice(tables[0], 1).forEach(function (img) {
                    let key = img['A'];
                    let value = img['B'];

                    map[key] = value;
                });

                cache['imgs'] = map;
                resolve(map);
            })
            .catch(reject);
        }
    })
}
