import { v4 as uuidv4 } from "uuid";

export default class TicketsService {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  createTicket = async (amount, purchaser) => {
    const ticketData = {
      code: uuidv4(),
      amount,
      purchaser,
    };

    return await this.ticketRepository.create(ticketData);
  };
}
