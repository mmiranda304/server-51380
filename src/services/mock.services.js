import { faker } from '@faker-js/faker'

class MockService {
    async getProducts() {
        try {
            const products = [];

            const generateProduct = () => {
                return {
                _id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price({ min: 2000, max: 60000, dec: 0 }),
                thumbnail: [faker.image.avatarLegacy()],
                code: `${faker.finance.pin(6)}`,
                stock: faker.number.int({ max: 100 }),
                category: faker.commerce.department(),
                status: faker.datatype.boolean(),
                };
            };

            do {
                products.push(generateProduct());
            } while (products.length < 50);

            return { 
                status: 'success', 
                payload: products,
            };
        } catch (error) {
            throw new Error('MockService.getProducts: ' + error); 
        }
    }

}
export const mockService = new MockService();