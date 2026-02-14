import { TicketModel } from "./models/ticket.model.js";

export class TicketDBManager {
  createTicket = async (ticketData) => {
    return await TicketModel.create(ticketData);
  };
}
