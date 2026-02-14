export class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getById = async (id) => {
    return await this.dao.getProductsFromCartByID(id);
  };

  create = async () => {
    return await this.dao.createCart();
  };

  addProduct = async (cid, pid) => {
    return await this.dao.addProductByID(cid, pid);
  };

  removeProduct = async (cid, pid) => {
    return await this.dao.deleteProductByID(cid, pid);
  };

  updateAll = async (cid, products) => {
    return await this.dao.updateAllProducts(cid, products);
  };

  updateQuantity = async (cid, pid, quantity) => {
    return await this.dao.updateProductByID(cid, pid, quantity);
  };

  clear = async (cid) => {
    return await this.dao.deleteAllProducts(cid);
  };
}
