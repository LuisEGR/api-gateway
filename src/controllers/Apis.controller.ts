import request from 'request';
import moment from 'moment-timezone';

const dataCtrl = new DataGatewayController();


const allApis: any = [];
export function autoDiscovery() {
    return new Promise((resolve, reject) => {
        const services: any[] = [];
        let servicesProcesed = 0;
        const servicesFound = Object.keys(process.env)
            .filter((e) => {
                // console.log("e:", e);
                return e.indexOf('PORT_8080_TCP_ADDR') !== -1;
            });

        console.log("servicesFound:", servicesFound);
        servicesFound.forEach((s) => {
            const url = 'http://' + process.env[s] + ':8080/describe';
            console.log("url:", url);
            request.get(url, { timeout: 1000 }, (err, res, body) => {
                servicesProcesed++;
                if (err == null) {
                    const b = JSON.parse(body);
                    b.apis = b.apis.map((api: any) => {
                        api.host = 'http://' + process.env[s] + ':8080';
                        api._id = Buffer.from(api.endpoint + api.method).toString('base64');
                        api._foundAt = moment().tz('America/Mexico_City').format();
                        api._lastRequest = null;
                        return api;
                    });
                    addSafeService(services, b.apis);
                }
                if (servicesProcesed === servicesFound.length) {
                    resolve(services);
                }
            });
        });
    });
}


// function addSafeService(arrayServices: any, arrayToAdd: any) {
//     arrayToAdd.forEach((api: any) => {
//         const existe = arrayServices.filter((s: any) => s._id === api._id).length;
//         if (existe) {
//             console.error("Se encontró un servicio duplicado:");
//             console.error("Existente:", existe);
//             console.error("Nuevo:", api);
//         } else {
//             arrayServices.push(api);
//         }
//     });
// }


// export function getApi(method: string, endpoint: string) {
//     if (allApis === null) {
//         const all = fs.readFileSync('routes.json', {encoding: 'utf-8'});
//         allApis = JSON.parse(all);
//     }
//     console.log("allApis:", allApis);

// }
