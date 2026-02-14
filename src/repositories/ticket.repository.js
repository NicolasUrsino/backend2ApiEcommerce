export class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create = async (data) => {
    return await this.dao.createTicket(data);
  };
}
