import { mockService } from "../services/mock.services.js";

class MockController {
    async generateProducts(req, res) {
        try {
            const products = await mockService.getProducts();
            return res.status(201).json(products);
        } catch (error) {
            console.error('Error in ProductController.getProducts:', error);
            return res.status(400).json({
                status: 'error',
                error: 'mock.controller - Error mockingp products',
            });
        }
    }
}
export const mockController = new MockController();