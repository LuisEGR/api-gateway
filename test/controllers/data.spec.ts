import { DataGatewayController } from '../../src/controllers/data.controller';

describe(`Al crear una nueva instancia de DataController`, () => {
    test('al instanciar una clase', () => {
        const dataController = new DataGatewayController();
        expect(dataController).toBeDefined();
    });
});
