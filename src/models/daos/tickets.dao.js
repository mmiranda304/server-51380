import { TicketModel } from "../schemas/tickets.schema.js";

class TicketsDAO {
    async getTicketById(_id) {
      try { 
        return await TicketModel.findOne({ _id: _id }).populate('products.product').lean();
      } catch (error) {
        throw new Error('TicketsDAO.getTicketById: ' + error);
      }
    }
    
    async addTicket(ticket) {
        try { 
            return await TicketModel.create(ticket);
        } catch (error) {
          throw new Error('TicketsDAO.addTicket: ' + error);
        }
      }
    
      async deleteTicket(_id) {
        try {
            return await TicketModel.deleteOne({ _id: _id });
        } catch (error) {
          throw new Error('TicketsDAO.deleteTicket: ' + error);
        }
      }
  }
  export const ticketsDAO = new TicketsDAO();