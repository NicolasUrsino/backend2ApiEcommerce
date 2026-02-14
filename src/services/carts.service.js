import { cartDBManager } from "../dao/cartDBManager.js";
import { productDBManager } from "../dao/productDBManager.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { TicketDBManager } from "../dao/ticketDBManager.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import crypto from "crypto";
import { transporter } from "../config/mailer.js";
export class CartService {
  constructor() {
    const ticketDAO = new TicketDBManager();
    this.ticketRepository = new TicketRepository(ticketDAO);

    const productDAO = new productDBManager();
    const cartDAO = new cartDBManager(productDAO);

    this.cartRepository = new CartRepository(cartDAO);
  }

  getCartById = async (id) => {
    const cart = await this.cartRepository.getById(id);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return cart;
  };

  createCart = async () => {
    return await this.cartRepository.create();
  };

  addProductToCart = async (cid, pid) => {
    return await this.cartRepository.addProduct(cid, pid);
  };

  removeProductFromCart = async (cid, pid) => {
    return await this.cartRepository.removeProduct(cid, pid);
  };

  updateCartProducts = async (cid, products) => {
    if (!Array.isArray(products)) {
      throw new Error("Formato de productos inválido");
    }

    return await this.cartRepository.updateAll(cid, products);
  };

  updateProductQuantity = async (cid, pid, quantity) => {
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }

    return await this.cartRepository.updateQuantity(cid, pid, quantity);
  };

  clearCart = async (cid) => {
    return await this.cartRepository.clear(cid);
  };
  purchaseCart = async (cid, user) => {

  if (user.role !== "user") {
    throw new Error("Solo los usuarios pueden comprar");
  }
  
  const cart = await this.cartRepository.getById(cid);

  
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
  
    let totalAmount = 0;
    const productsNotProcessed = [];
  
    for (const item of cart.products) {
      const product = item.product;
  
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
      } else {
        productsNotProcessed.push(item);
      }
    }
  
  
    cart.products = productsNotProcessed;
    await cart.save();
  
    if (totalAmount === 0) {
      return {
        message: "No se pudo procesar ningún producto",
        productsNotProcessed
      };
    }
  
    const ticket = await this.ticketRepository.create({
      code: crypto.randomUUID(),
      amount: totalAmount,
      purchaser: user.email
    });
  
  
  try {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: user.email,
    subject: "Compra realizada",
    html: `
      <h1>Gracias por tu compra</h1>
      <p>Código: ${ticket.code}</p>
      <p>Total: $${ticket.amount}</p>
    `
  });
} catch (error) {
  console.error("ERROR COMPLETO MAIL:", error);
}


  
    return {
      ticket,
      productsNotProcessed
    };
  };
}
