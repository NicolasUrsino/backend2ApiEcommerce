export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = (query) => this.dao.getAllProducts(query);

  getById = (id) => this.dao.getProductByID(id);

  create = (data) => this.dao.createProduct(data);

  update = (id, data) => this.dao.updateProduct(id, data);

  delete = (id) => this.dao.deleteProduct(id);
}
