const ExcelDb = nodeRequire('./libs/excel-db.js');
const _ = nodeRequire('lodash');
const GOVS = nodeRequire('./libs/govs.js');
const EC = nodeRequire('./libs/ec.js');
const MODELS = nodeRequire('./libs/products.all.feild.alias.js');
const QUANZHONG = nodeRequire('./libs/quanzhong.js');

module.exports = class PruductsAll extends ExcelDb {
    constructor () {
        super('products-all');

        this.cache = this.cache || {};
    }

    open(){
        return super.open().then((data) => {
            this.tables[0] = _.slice(this.tables[0], 2);
            this.translateData();
        });
    }

    /**
     * 将字段名Excel的列名转换成别名
     */
    translateData() {
        let table = this.tables[0];

        table.forEach((row) => {
            let fieldName;
            let fieldValue;

            for (let k in MODELS) {
                fieldName = MODELS[k];
                fieldValue = row[fieldName];
                fieldValue = this.isEmpty(fieldValue) ?
                    (k.match(/[Pp]rice/)?0:'') :
                    (k.match(/[Pp]rice/)?parseFloat(fieldValue):fieldValue);

                row[k] = fieldValue;
                delete row[fieldName];
            }
        });
    }

    isEmpty(val) {
        if (!val || val === '--' || val === '——') {
            return true;
        }

        return false;
    }

    /**
     * 读取不为空的属性值
     */
    a(row, prop) {
        var val = row[MODELS[prop]];

        if (this.isEmpty(val)) {
            val = 0;
        }
        return val;
    }

    /**
     * 获取政府商品列表
     * @param  {[type]} row [description]
     * @return {[type]}     [description]
     */
    getProductsOfAllGovs (product) {
        product = this.getProductById(product);

        this.cache.govs = this.cache.govs || {};

        if (this.cache.govs[product.id]) {
            return this.cache.govs[product.id];
        }

        let list = [];
        let govAlias, priceKey, nameKey, linkKey, provinceName;

        GOVS.forEach((gov)=>{
            govAlias = gov.alias;
            priceKey = 'gov_' + govAlias + '_productPrice';
            nameKey = 'gov_' + govAlias + '_productName';
            linkKey = 'gov_' + govAlias + '_link';

            list.push({
                id: product['id'],
                province: gov.name,
                govName: gov.name,
                govAlias: gov.alias,
                category: product['category'],
                price: this.isEmpty(product[priceKey]) ? 0 : parseFloat(product[priceKey]),
                name: product[nameKey],
                link: product[linkKey]
            });
        });

        this.cache.govs[product.id] = list;

        return list;
    }

    /**
     * 获取电商商品列表
     * @param  {[type]} row [description]
     * @return {[type]}     [description]
     */
    getProductsOfAllEcoms (product) {
        product = this.getProductById(product);

        this.cache.ec = this.cache.ec || {};

        if (this.cache.ec[product.id]) {
            return this.cache.ec[product.id];
        }

        let list = [];
        let ecAlias, priceKey, nameKey, linkKey, provinceName;

        EC.forEach((ec)=>  {
            ecAlias = ec.alias;
            priceKey = 'ec_' + ecAlias + '_productPrice';
            nameKey = 'ec_' + ecAlias + '_productName';
            linkKey = 'ec_' + ecAlias + '_link';

            list.push({
                id: product['id'],
                ecName: ec.name,
                ecAlias: ec.alias,
                category: product['category'],
                price: this.isEmpty(product[priceKey]) ? 0 : parseFloat(product[priceKey]),
                name: product[nameKey],
                link: product[linkKey]
            });
        });

        this.cache.ec[product.id] = list;

        return list;
    }

    /**
     * 产品平均价
     * @param  {[type]} id [description]
     * @return {[type]}           [description]
     */
    getProductAverge(id) {
        return this.zscxj(id);
    }

    /**
     * 实体市场产品平均价
     * @param  {[type]} id [description]
     * @return {[type]}           [description]
     */
    getMarketProductAvergeByWeight(id) {
        let product = this.getProductById(id);
        let localPrice = product.gov_sichuan_productPrice;
        let marketPrice = product.marketPrice;

        return (localPrice + marketPrice) / 2;
    }

    /**
     * 电商单品加权平均价
     * @param  {[type]} id [description]
     * @return {[type]}           [description]
     */
    avergeEcQuanzhong(id) { return this.avergeEcProductByWeight(id); }
    avergeEcProductByWeight (product) {
        product = this.getProductById(product);
        let cache = this.cache.avergeEc = this.cache.avergeEc || {};
        let id = product.id;

        if (cache[id]) {
            return cache[id];
        }

        let total = 0;
        let products = this.getProductsOfAllEcoms(product);
        let prices = 0;
        let quanzhong;

        products.forEach((prod)=>{
            quanzhong = QUANZHONG.ec[prod.ecName] || 0;
            if (quanzhong > 0 && prod.price > 0) {
                total += quanzhong;
                prices += (parseFloat(prod.price) * quanzhong);
            }
        });

        cache[id] = (prices / total).toFixed(2);
        return cache[id];
    }

    /**
     * 政府单品加权平均采购价
     * @return {Number} [description]
     */
    avergeGovQuanzhong (id) { return this.avergeGovProductByWeight(id); }
    avergeGovProductByWeight (id) {
        let product = this.getProductById(id);
        let cache = this.cache.avergeGov = this.cache.avergeGov || {};

        if (cache[id]) {
            return cache[id];
        }

        let total = 0;
        let products = this.getProductsOfAllGovs(product);
        let prices = 0;
        let quanzhong;

        products.forEach((prod)=>{
            quanzhong = QUANZHONG.gov[prod.govName] || 0;
            if (quanzhong > 0 && prod.price > 0) {
                total += quanzhong;
                prices += (parseFloat(prod.price) * quanzhong);
            }
        });

        cache[id] = (prices / total).toFixed(2);
        return cache[id];
    }

    /**
     * 单品指数畅销价
     */
    zscxj (product) {
        product = this.getProductById(product);
        let cache = this.cache.zscxj = this.cache.zscxj || {};
        let id = product.id;

        if (cache[id]) {
            return cache[id];
        }

        let govAverge = this.avergeGovProductByWeight(product);
        let ecAverge = this.avergeEcProductByWeight(product);
        let market = product.market_productPrice;

        cache[id] = (market * 0.7) + (ecAverge * 0.2) + (govAverge * 0.1);

        return parseFloat(cache[id].toFixed(4));
    }

    /**
     * 本地商品偏离度
     * @return {[type]} [description]
     */
    localOffset (id, govAlias) {
        let product = this.getProductById(id);
        let cacheKey = id + govAlias;
        let cache = this.cache.localOffset = this.cache.localOffset || {};
        if (cache[cacheKey]) {
            return cache[cacheKey];
        }

        let productKey = 'gov_' + govAlias + '_productPrice';
        let localPrice = product[productKey];
        let zscxj = this.zscxj(id);

        cache[cacheKey] = parseFloat(((localPrice-zscxj) / zscxj).toFixed(4));

        return cache[cacheKey];
    }

    /**
     * 政采偏离度
     */
    govOffset (product) {
        product = this.getProductById(product);
        let cache = this.cache.govOffset = this.cache.govOffset || {};
        let id = product.id;

        if (cache[id]) {
            return cache[id];
        }

        let govAverge = this.avergeGovProductByWeight(product);
        let zscxj = this.zscxj(product);

        cache[id] = parseFloat(((govAverge-zscxj) / zscxj).toFixed(4));

        return cache[id];
    }

    /**
     * 电商偏离度
     */
    ecOffset (product) {
        product = this.getProductById(product);
        let cache = this.cache.ecOffset = this.cache.ecOffset || {};
        let id = product.id;

        if (cache[id]) {
            return cache[id];
        }

        let ecAverge = this.avergeEcProductByWeight(product);
        let zscxj = this.zscxj(product);

        cache[id] = parseFloat(((ecAverge-zscxj) / zscxj).toFixed(4));

        return cache[id];
    }

    /**
     * 实体市场偏离度
     */
    marketOffset (product) {

        product = this.getProductById(product);

        let cache = this.cache.marketOffset = this.cache.marketOffset || {};
        let id = product.id;

        if (cache[id]) {
            return cache[id];
        }

        let market = product.market_productPrice;
        let zscxj = this.zscxj(product);

        cache[id] = parseFloat(((market-zscxj) / zscxj).toFixed(4));

        return cache[id];
    }

    /**
     * 配型指数平均价
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getModelAverge(modelName) {
        let cache = this.cache.prodOfModel = this.cache.prodOfModel || {};

        if (cache[modelName]) {
            return cache[modelName];
        }

        let prodsOfModel = cache[modelName] = _.filter(this.tables[0], { 'model': modelName });
        let totalPrice = 0;

        prodsOfModel.forEach((prod) => {
            totalPrice += parseFloat(this.zscxj(prod));
        });

        return cache[modelName] = parseFloat((totalPrice/prodsOfModel.length).toFixed(2));
    }

    /**
     * 实体市场配型指数平均价
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getModelAvergeOfMarket(modelName) {
        let cache = this.cache.marketPriceOfModel = this.cache.marketPriceOfModel || {};

        if (cache[modelName]) {
            return cache[modelName];
        }

        let prodsOfModel = cache[modelName] = _.filter(this.tables[0], { 'model': modelName });
        let totalPrice = 0;

        prodsOfModel.forEach((prod) => {
            totalPrice += parseFloat(prod.market_productPrice);
        });

        return cache[modelName] = parseFloat((totalPrice/prodsOfModel.length).toFixed(2));
    }

    /**
     * 电商配型指数平均价
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getModelAvergeOfEc(modelName) {
        let cache = this.cache.ecPriceOfModel = this.cache.ecPriceOfModel || {};

        if (cache[modelName]) {
            return cache[modelName];
        }

        let prodsOfModel = cache[modelName] = _.filter(this.tables[0], { 'model': modelName });
        let totalPrice = 0;

        prodsOfModel.forEach((prod) => {
            totalPrice += parseFloat(this.avergeEcProductByWeight(prod));
        });

        return cache[modelName] = parseFloat((totalPrice/prodsOfModel.length).toFixed(2));
    }

    /**
     * 政采配型指数平均价
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getModelAvergeOfGov(modelName) {
        let cache = this.cache.govPriceOfModel = this.cache.govPriceOfModel || {};

        if (cache[modelName]) {
            return cache[modelName];
        }

        let prodsOfModel = cache[modelName] = _.filter(this.tables[0], { 'model': modelName });
        let totalPrice = 0;

        prodsOfModel.forEach((prod) => {
            totalPrice += parseFloat(this.avergeGovProductByWeight(prod));
        });

        return cache[modelName] = parseFloat((totalPrice/prodsOfModel.length).toFixed(2));
    }

    /**
     * 实体市场配型偏离度
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getModelOffsetOfMarket(modelName) {
        let cache = this.cache.marketOffsetOfModel = this.cache.marketOffsetOfModel || {};

        if (cache[modelName]) { return cache[modelName]; }

        let avergeModal = this.getModelAverge(modelName);
        let avergeModalOfMarket = this.getModelAvergeOfMarket(modelName);

        return cache[modelName] = parseFloat(((avergeModalOfMarket - avergeModal) / avergeModal).toFixed(2));
    }

    /**
     * 电商配型偏离度
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getModelOffsetOfEc(modelName) {
        let cache = this.cache.ecOffsetOfModel = this.cache.ecOffsetOfModel || {};

        if (cache[modelName]) { return cache[modelName]; }

        let avergeModal = this.getModelAverge(modelName);
        let avergeModalOfEc = this.getModelAvergeOfEc(modelName);

        return cache[modelName] = parseFloat(((avergeModalOfEc - avergeModal) / avergeModal).toFixed(2));
    }

    /**
     * 政采配型偏离度
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getModelOffsetOfGov(modelName) {
        let cache = this.cache.govOffsetOfModel = this.cache.govOffsetOfModel || {};

        if (cache[modelName]) { return cache[modelName]; }

        let avergeModal = this.getModelAverge(modelName);
        let avergeModalOfGov = this.getModelAvergeOfGov(modelName);

        return cache[modelName] = parseFloat(((avergeModalOfGov - avergeModal) / avergeModal).toFixed(2));
    }

    /**
     * 实体市场单品偏离度
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getProductOffsetOfMarket(id, govAlias) {
        let cacheKey = id+govPriceKey;
        let cache = this.cache.marketOffsetOfModel = this.cache.marketOffsetOfModel || {};
        if (cache[cacheKey]) { return cache[cacheKey]; }

        let product = this.getProductById(id);
        let govPriceKey = 'gov_' + govAlias + '_productPrice';
        let govPrice = product[govPriceKey];
        let marketPrice = product.market_productPrice;

        return cache[cacheKey] = parseFloat(((govPrice - marketPrice) / marketPrice).toFixed(2));
    }

    /**
     * 电商单品偏离度
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getProductOffsetOfEc(id, govAlias) {
        let cache = this.cache.ecOffsetOfModel = this.cache.ecOffsetOfModel || {};

        if (cache[modelName]) { return cache[modelName]; }

        let avergeModal = this.getModelAverge(modelName);
        let avergeModalOfEc = this.getModelAvergeOfEc(modelName);

        return cache[modelName] = parseFloat(((avergeModalOfEc - avergeModal) / avergeModal).toFixed(2));
    }

    /**
     * 政采单品偏离度
     * @param  {[type]} modelName [description]
     * @return {[type]}           [description]
     */
    getProductOffsetOfGov(id, govAlias) {
        let cache = this.cache.govOffsetOfModel = this.cache.govOffsetOfModel || {};

        if (cache[modelName]) { return cache[modelName]; }

        let avergeModal = this.getModelAverge(modelName);
        let avergeModalOfGov = this.getModelAvergeOfGov(modelName);

        return cache[modelName] = parseFloat(((avergeModalOfGov - avergeModal) / avergeModal).toFixed(2));
    }

    /**
     * 获取本地采购价格高于中电指数价格的产品
     * @param  {String} gov    政府单位别名
     * @param  { Number} min 参照百分比，例（50：表示高于50%， 30：表示高于30%）；
     * @param  { Number} max 参照百分比，例（50：表示低于50%， 30：表示低于30%）；
     * @return {Array}
     */
    getProducrsOvertop(govAlias, min, max=false) {

        max = typeof(max) === 'number' ? max : parseFloat(max);
        max = isNaN(max) ? false : max;

        let cache = this.cache.overtop = this.cache.overtop || {};
        let cacheKey = 'overtop_' + govAlias + '_min:' + (min||0) + '_max:' + (max===false ? 'all' : max);
        if (cache[cacheKey]) { return cache[cacheKey]; }

        let results = [];
        _.filter(this.tables[0], function(o) {
            return o['gov_'+ govAlias +'_productPrice'] !== 0;
        })
        .forEach((prod) => {
            let avergePrice = this.zscxj(prod);
            let govPriceKey = 'gov_' + govAlias + '_productPrice'
            let govPrice = parseFloat(prod[govPriceKey]);
            let offset = (govPrice-avergePrice)/avergePrice*100;
            let lessThanMax = (max===false || offset < max);

            if (offset >= min && lessThanMax) {
                results.push(prod);
            }
        });

        return cache[cacheKey] = results;
    }

    /**
     * 获取某一子类本地采购价格高于中电指数价格的产品
     * @param  {String} gov    政府单位别名
     * @param  {String} category    政府单位别名
     * @param  { Number} min 参照百分比，例（50：表示高于50%， 30：表示高于30%）；
     * @param  { Number} max 参照百分比，例（50：表示低于50%， 30：表示低于30%）；
     * @return {Array}
     */
    getProducrsOvertopOfCategory(govAlias, category, min, max) {
        let cache = this.cache.overtopOfCategory = this.cache.overtopOfCategory || {};
        let cacheKey = 'overtopOfCategory_' + govAlias + '_min:' + (min||0) + '_max:' + (max||'all');
        if (cache[cacheKey]) { return cache[cacheKey]; }

        let results = [];

        _.filter(this.tables[0], {'category': category })
        .forEach((prod) => {
            let avergePrice = this.zscxj(prod);
            let govPriceKey = 'gov_' + govAlias + '_productPrice'
            let govPrice = parseFloat(prod[govPriceKey]);
            let offset = (govPrice-avergePrice)/avergePrice*100;

            if (offset >= min && (!max || offset < max)) {
                results.push(prod);
            }
        });

        return cache[cacheKey] = results;
    }

    getProductById(id) {
        if (typeof id === 'string') {
            let prod = _.filter(this.tables[0], {id: id});

            return prod ? prod[0] : null;
        } else {
            return id;
        }
    }

    getProductByCategory(category) {
        return _.filter(this.tables[0], {category: category});
    }

    getProductByModel(model) {
        return _.filter(this.tables[0], {model: model});
    }

    getCategoryTree() {

        let tree = [];
        let category = _.groupBy(this.tables[0], 'category');
        let cate;
        let childList;
        let childItem;

        for (let k in category) {
            cate = category[k];
            childItem = _.toArray(_.groupBy(_.toArray(cate), 'model'));
            childList = [];
            childItem.forEach(function(sub) {
                childList.push({
                    name: sub[0].model,
                    type: 'model'
                });
            });

            tree.push({
                name: k,
                type: 'category',
                children: childList
            });
        }

        return tree;
    }

    getCategoryFlatTree() {

        let tree = [];
        let category = _.groupBy(this.tables[0], 'category');
        let cate;
        let childList;
        let childItem;

        for (let k in category) {
            cate = category[k];
            childItem = _.toArray(_.groupBy(_.toArray(cate), 'model'));
            childList = [];

            tree.push({
                name: k,
                type: 'category'
            });

            childItem.forEach(function(sub) {
                tree.push({
                    name: sub[0].model,
                    type: 'model'
                });
            });
        }

        return tree;
    }

}
