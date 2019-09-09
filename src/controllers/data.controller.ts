import { MongoClient, Collection } from 'mongodb';


export interface ApiDescription {
    name: string;
    host: string;
    port: string;
    method: string;
    endpoint: string;
    totalRequests?: number;
    timeLastRequest?: Date;
    foundAt?: Date;
    lastDuration?: number; // ms
    version: string;
}

export enum ApiStatus {
    NOT_FOUND = 0,
    OK = 1,
    TIMEOUT = 2,
}

export interface ApiSearch {
    method?: string;
    endpoint?: string;
}

// DataGatewayController Singleton
export class DataGatewayController {

    public static getConection(): Promise<Collection> {
        return new Promise((resolve) => {
            if (this.conection) {
                resolve(this.conection);
            } else {
                return DataGatewayController.connect();
            }
        });
    }

    public static getInstance() {
        if (!DataGatewayController.instance) {
            DataGatewayController.instance = new DataGatewayController();
        }
        return DataGatewayController.instance;
    }

    private static conection: Collection;
    private static instance: DataGatewayController;

    private static connect() {
        const collectionName = process.env.MONGO_COLLECTION || 'prueba';
        const dbName = process.env.MONGO_DB || 'gateway';
        const userMongo = process.env.MONGO_USER || 'mongoadmin';
        const passMongo = process.env.MONGO_PASSWORD || 'mongoadmin';
        const hostMongo = process.env.MONGO_HOST || 'localhost';
        const portMongo = process.env.MONGO_PORT || '27017';
        const dbUrl = 'mongodb://' + userMongo + ':' + passMongo + '@' + hostMongo + ':' + portMongo;
        const client = new MongoClient(dbUrl, { useNewUrlParser: true });
        return client.connect().then((cliente: MongoClient) => {
            DataGatewayController.conection = cliente.db(dbName).collection(collectionName);
            DataGatewayController.conection.createIndex({method: 1, endpoint: 1}, {unique: true});

            return DataGatewayController.conection;
        }).catch((e) => {
            console.error("Error de conexión con MongoDB: ", e.toString());
        });
    }
    private allApisCache: any = [];

    private constructor() {
        // this.collectionName = process.env.MONGO_COLLECTION || 'prueba';
        // this.dbName = process.env.MONGO_DB || 'gateway';
        // const userMongo = process.env.MONGO_USER || 'mongoadmin';
        // const passMongo = process.env.MONGO_PASSWORD || 'mongoadmin';
        // const hostMongo = process.env.MONGO_HOST || 'localhost';
        // const portMongo = process.env.MONGO_PORT || '27017';
        // this.dbUrl = 'mongodb://' + userMongo + ':' + passMongo + '@' + hostMongo + ':' + portMongo;
        // DataGatewayController.connect();
    }

    public addApi = async (api: ApiDescription) => {
        api.foundAt = new Date();
        const collection = await DataGatewayController.getConection();
        return collection.insertOne(api)
            .catch((e) => e.toString());
    }

    public deleteCache =  () => {
        this.allApisCache.length = 0;
        // const collection = await DataGatewayController.getConection();
        // return collection.deleteMany({})
        // .catch((e) => e.toString());
    }

    public getApi = async (filter: ApiSearch): Promise<ApiDescription | null> => {
        const api = this.findLocalApi(filter);
        if (api) {
            return new Promise((resolve) => {
                resolve(api);
            });
        } else {
            const collection = await DataGatewayController.getConection();
            return collection.findOne(filter).catch((e) => e.toString());
        }
    }

    public getAllApis = async (): Promise<any[]> => {
        const collection = await DataGatewayController.getConection();

        return collection.find({})
            .toArray().then((apis) => {
                this.allApisCache = [...this.allApisCache, ...apis];
                return apis;
            }).catch((e) => e.toString());
    }

    public registerNewRequest = async (filter: ApiSearch, status: ApiStatus, lastDuration: number) => {
        const collection = await DataGatewayController.getConection();

        return collection.updateOne(filter, {
            $inc: {
                totalRequest: 1,
            },
            $currentDate: {
                timeLastRequest: true,
            },
            $set: {
                status,
                lastDuration,
            },
        });
    }

    public findLocalApi = (filter: ApiSearch) => {
        let api = null;
        if (!this.allApisCache) return null;
        const result = this.allApisCache.filter((api) => {
            return api.method === filter.method &&
                api.endpoint === filter.endpoint;
        });

        if (result.length) api = result[0];
        return api;
    }

}

// Connection URL

// Database Name

// Use connect method to connect to the server


// const prueba = new DataGatewayController();


// prueba.addApi({
//     name: "Acceso Cliente",
//     host: 'http://localhost',
//     endpoint: '/autenticacion/accesoCliente',
//     method: 'POST',
//     port: '8080',
//     version: '1.0.2',
// }).then((res) => {
//     console.log("res:", res);
// }).catch((e) => {
//     console.error("ERRORRRR", e);
// });


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
