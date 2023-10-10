import { UserModel } from '../models/schemas/users.schema.js';
import { cartService } from './cart.service.js';
import { createHash } from '../utils.js';
import { usersDAO } from '../models/daos/users.dao.js';

class UsersService {
  validateUser(firstName, lastName, email, age) {
    if ( !firstName || !lastName || !email || !age ) {
      throw new Error('validation error: please complete firstName, lastname, email and age.');
    }
    const emailExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!emailExpression.test(email)) {
    //   throw new Error('Email format not valid');
    // }

  }
  validatePassword(password) {
    const passPattern = /^.{8,20}$/;      //Password with 8-20 caracters lenght 
    return passPattern.test(password);
  }

  async getUsers() {
    try {
      return await usersDAO.getUsers();
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
      
      if( !this.validatePassword(user.password) ) {
        throw new Error('validation error: password must be 8 to 20 caracters lenght.');
      }

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

  async updateActivity(_id) {
    try {
      const lastActivity = new Date();

      return await usersDAO.updateActivity(_id, lastActivity);
    } catch (error) {
      throw new Error('UsersService.updateActivity: ' + error);
    }
  }
  async cleanUsers() {
    try {
      const offlineTime = new Date();
      offlineTime.setDate(offlineTime.getDate() - 2);     // Setting for 2 days of inactivity
      //offlineTime.setMinutes(offlineTime.getMinutes() - 2);     // Setting for 2 min of inactivity

      return await usersDAO.cleanUsers(offlineTime);
    } catch (error) {
      throw new Error('UsersService.cleanUsers: ' + error);
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