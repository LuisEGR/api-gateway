"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var ApiStatus;
(function (ApiStatus) {
    ApiStatus[ApiStatus["NOT_FOUND"] = 0] = "NOT_FOUND";
    ApiStatus[ApiStatus["OK"] = 1] = "OK";
    ApiStatus[ApiStatus["TIMEOUT"] = 2] = "TIMEOUT";
})(ApiStatus = exports.ApiStatus || (exports.ApiStatus = {}));
var DataGatewayController = /** @class */ (function () {
    function DataGatewayController() {
        var _this = this;
        this.addApi = function (api) {
            var client = new mongodb_1.MongoClient(_this.dbUrl, { useNewUrlParser: true });
            return client.connect().then(function () {
                var db = client.db(_this.dbName);
                var collection = db.collection(_this.collectionName);
                api.foundAt = new Date();
                return collection
                    .insertOne(api)
                    .finally(function () {
                    client.close();
                });
            });
        };
        this.getApi = function (filter) {
            var client = new mongodb_1.MongoClient(_this.dbUrl, { useNewUrlParser: true });
            return client.connect().then(function () {
                var db = client.db(_this.dbName);
                var collection = db.collection(_this.collectionName);
                return collection.findOne(filter)
                    .finally(function () {
                    client.close();
                });
            });
        };
        this.registerNewRequest = function (filter, status, lastDuration) {
            var client = new mongodb_1.MongoClient(_this.dbUrl, { useNewUrlParser: true });
            return client.connect().then(function () {
                var db = client.db(_this.dbName);
                var collection = db.collection(_this.collectionName);
                return collection
                    .updateOne(filter, {
                    $inc: {
                        totalRequest: 1,
                    },
                    $currentDate: {
                        timeLastRequest: true,
                    },
                    $set: {
                        status: status,
                        lastDuration: lastDuration,
                    },
                })
                    .finally(function () {
                    client.close();
                });
            });
        };
        this.collectionName = process.env.MONGO_COLLECTION || 'prueba';
        this.dbName = process.env.MONGO_DB || 'gateway';
        var userMongo = process.env.MONGO_USER || 'mongoadmin';
        var passMongo = process.env.MONGO_PASSWORD || 'mongoadmin';
        var hostMongo = process.env.MONGO_HOST || 'localhost:27017';
        this.dbUrl = 'mongodb://' + userMongo + ':' + passMongo + '@' + hostMongo;
        console.log("this.dbUrl:", this.dbUrl);
    }
    return DataGatewayController;
}());
exports.DataGatewayController = DataGatewayController;
// Connection URL
// Database Name
// Use connect method to connect to the server
// const prueba = new DataGatewayController();
// // prueba.addApi({
// //     host: 'asdasd34343',
// //     endpoint: '/hola/mundo2',
// //     method: 'POST',
// //     port: '8080',
// //     version: '1.0.2',
// // }).then((res) => {
// //     console.log("res:", res);
// // }).catch((e) => {
// //     console.error("ERRORRRR", e);
// // });
// // prueba.registerNewRequest({method: 'GET', endpoint: '/hola/mundo'}, ApiStatus.OK, 1000)
// // .then((res: any) => {
// //     res = res as ApiDescription;
// //     console.log("res:", res);
// // }).catch((e) => {
// //     console.error(e);
// // });
// prueba.getApi({method: 'POST', endpoint: '/hola/mundo2'})
// .then((res: any) => {
//     console.log("res:", res);
// }).catch((e) => {
//     console.error(e);
// });
