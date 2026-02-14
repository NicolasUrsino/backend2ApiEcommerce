export default class ProductsService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  getProducts = async (query) => {
    return await this.productRepository.getAll(query);
  };

  getProductById = async (id) => {
    return await this.productRepository.getById(id);
  };

  createProduct = async (data) => {
    return await this.productRepository.create(data);
  };

  updateProduct = async (id, data) => {
    return await this.productRepository.update(id, data);
  };

  deleteProduct = async (id) => {
    return await this.productRepository.delete(id);
  };
}
