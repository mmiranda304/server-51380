import { usersService } from "../services/users.service.js";

class UsersController {

    async getUsers(req, res) {
        try {
            const users = await usersService.getUsers();
            return res.status(200).json({
                status: "success",
                payload: users,
            });
        } catch (error) {
            console.error('Error in UsersController.getUsers:', error);
            return res.status(400).json({
                status: 'error',
                error: 'users.controller - An error occurred while getting users',
            });
        }
    }

    async addUser(req, res) {
        try {
            const { firstName, lastName, email, age, isAdmin, role, password } = req.body;
            const userCreated = await usersService.addUser(firstName, lastName, email, age, isAdmin, role, password);
            return res.status(201).json({
                status: 'success',
                msg: 'user created',
                payload: userCreated,
            });
        } catch (error) {
            console.error('Error in UsersController.addUser:', error);
            return res.status(400).json({
                status: 'error',
                error: 'users.controller - An error occurred while adding the user',
            });
        }
    }

    async deleteUser(req, res) {
        try {
        const { id } = req.params;
        const deleted = await usersService.deleteUser(id);
        return res.status(201).json({
            status: 'success',
            msg: 'user deleted',
        });
        } catch (error) {
            console.error('Error in UsersController.deleteUser:', error);
            return res.status(400).json({
                status: 'error',
                error: 'users.controller - An error occurred while deleting the user',
            });
        }
    }
    
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { firstName, lastName, email, age, isAdmin, role } = req.body;
            const userUptaded = await usersService.updateUser(id, firstName, lastName, email, age, isAdmin, role);

            return res.status(201).json({
                status: 'success',
                payload: userUptaded,
            });
        } catch (error) {
            console.error('Error in UsersController.updateUser:', error);
            return res.status(400).json({
                status: 'error',
                error: 'users.controller - An error occurred while updating the user',
            });
        }
    }
}
export const usersController = new UsersController();