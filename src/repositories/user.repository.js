export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = () => this.dao.get();

  getById = (id) => this.dao.getBy({ _id: id });

  getByEmail = (email) => this.dao.getBy({ email });

  create = (userData) => this.dao.create(userData);

  update = (id, updateData) => this.dao.update(id, updateData);

  delete = (id) => this.dao.delete(id);
}
