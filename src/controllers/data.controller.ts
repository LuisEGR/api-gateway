import { MongoClient, Db } from 'mongodb';


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

export class DataGatewayController {

    private dbUrl: string;
    private dbName: string;
    private collectionName: string;

    constructor() {
        this.collectionName = process.env.MONGO_COLLECTION || 'prueba';
        this.dbName = process.env.MONGO_DB || 'gateway';
        const userMongo = process.env.MONGO_USER || 'mongoadmin';
        const passMongo = process.env.MONGO_PASSWORD || 'mongoadmin';
        const hostMongo = process.env.MONGO_HOST || 'localhost:27017';
        this.dbUrl = 'mongodb://' + userMongo + ':' + passMongo + '@' + hostMongo;
        console.log("this.dbUrl:", this.dbUrl);

    }



    public addApi = (api: ApiDescription) => {
        const client = new MongoClient(this.dbUrl, { useNewUrlParser: true });
        return client.connect().then(() => {
            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            api.foundAt = new Date();
            return collection
                .insertOne(api)
                .finally(() => {
                    client.close();
                });
        });
    }

    public getApi = (filter: ApiSearch): Promise<ApiDescription | null> => {
        const client = new MongoClient(this.dbUrl, { useNewUrlParser: true });
        return client.connect().then(() => {
            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            return collection.findOne(filter)
                .finally(() => {
                    client.close();
                });
        });
    }

    public registerNewRequest = (filter: ApiSearch, status: ApiStatus, lastDuration: number) => {
        const client = new MongoClient(this.dbUrl, { useNewUrlParser: true });

        return client.connect().then(() => {
            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            return collection
                .updateOne(filter, {
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

                })
                .finally(() => {
                    client.close();
                });
        });
    }

}

// Connection URL

// Database Name

// Use connect method to connect to the server


const prueba = new DataGatewayController();


// prueba.addApi({
//     name: "Acceso Cliente",
//     host: 'asdasd34343',
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
