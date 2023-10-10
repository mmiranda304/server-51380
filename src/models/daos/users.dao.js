import { UserModel } from "../schemas/users.schema.js";

class UsersDAO {
    async getUsers() {
      try { 
        return UserModel.find({}, 'firstName lastName email role');

        // return await UserModel.find({});
      } catch (error) {
        throw new Error('UsersDAO.getUsers: ' + error);
      }
    }
    
    async getUserByEmail(email) {
      try { 
        return await UserModel.findOne({ email: email });;
      } catch (error) {
        throw new Error('UsersDAO.getUserByEmail: ' + error);
      }
    }

    async getUserById(_id) {
      try { 
        return await UserModel.findOne({ _id: _id });;
      } catch (error) {
        throw new Error('UsersDAO.getUserById: ' + error);
      }
    }
    
    async addUser(user) {
        try { 
            return await UserModel.create(user);
        } catch (error) {
          throw new Error('UsersDAO.addUser: ' + error);
        }
      }
    
      async updateUser(_id, firstName, lastName, email, age, isAdmin, role) {
        try { 
            return await UserModel.updateOne({ _id }, { firstName, lastName, email, age, isAdmin, role });
        } catch (error) {
          throw new Error('UsersDAO.updateUser: ' + error);
        }
      }
    
      async deleteUser(_id) {
        try {
            return await UserModel.deleteOne({ _id: _id });
        } catch (error) {
          throw new Error('UsersDAO.deleteUser: ' + error);
        }
      }

      async updateActivity(_id, lastActivity) {
        try {
          return await UserModel.updateOne({ _id }, { lastActivity });
        } catch (error) {
          throw new Error('UsersDAO.updateActivity: ' + error);
        }
      }
      async cleanUsers(offlineTime) {
        try {
            return UserModel.deleteMany({ lastActivity: { $lt: offlineTime } });
        } catch (error) {
          throw new Error('UsersDAO.cleanUsers: ' + error);
        }
      }
  }
  export const usersDAO = new UsersDAO();