import { UserModel } from '../models/schemas/users.schema.js';
import { cartService } from './cart.service.js';
import { createHash } from '../utils.js';
import { usersDAO } from '../models/daos/users.dao.js';

class UsersService {
  validateUser(firstName, lastName, email, age) {
    if ( !firstName || !lastName || !email || !age ) {
      console.log('validation error: please complete firstName, lastname, email and age.');
      throw new Error('validation error: please complete firstName, lastname, email and age.');
    }
  }
  
  async getUsers() {
    try {
      return await UserModel.find({});
    } catch (error) {
      throw new Error('UsersService.getUsers: ' + error);
    }
  }

  async getUserByEmail(email) {
    try {
      return await usersDAO.getUserByEmail(email);
    } catch (error) {
      throw new Error('UsersService.getUserByEmail: ' + error);
    }
  }

  async getUserById(_id) {
    try {
      return await usersDAO.getUserById(_id);
    } catch (error) {
      throw new Error('UsersService.getUserById: ' + error);
    }
  }

  async addUser(user) {
    try { 
      this.validateUser(user.firstName, user.lastName, user.email, user.age);
      const newCart = await cartService.addCart();
      const cartID = newCart._id.toString();
      const newUser = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: Number(user.age),
        password: createHash(user.password),
        cart: cartID,
        isAdmin: user.isAdmin,
        role: user.role,
      };
      return await usersDAO.addUser(newUser);
    } catch (error) {
      throw new Error('UsersService.addUser: ' + error);
    }
  }

  async updateUser(_id, firstName, lastName, email, age, isAdmin, role) {
    try { 
      this.validateUser(firstName, lastName, email, age);
      
      return await usersDAO.updateUser(_id, firstName, lastName, email, age, isAdmin, role);
    } catch (error) {
      throw new Error('UsersService.updateUser: ' + error);
    }
  }

  async deleteUser(_id) {
    try {
      return await usersDAO.deleteUser(_id);
    } catch (error) {
      throw new Error('UsersService.deletedUser: ' + error);
    }
  }
}
export const usersService = new UsersService();