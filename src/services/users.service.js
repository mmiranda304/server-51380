import { UserModel } from '../DAO/models/users.model.js';
import { cartService } from './cart.service.js';
import { createHash } from '../utils.js';
import { usersDAO } from '../DAO/classes/users.dao.js';

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

  async addUser(firstName, lastName, email, age, isAdmin, role, password) {
    try { 
      this.validateUser(firstName, lastName, email, age, role, password);
      const newCart = await cartService.addCart();
      const cartID = newCart._id.toString();
      const newUser = {
        email: email,
        firstName,
        lastName,
        age: Number(age),
        password: createHash(password),
        cart: cartID,
        isAdmin,
        role,
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