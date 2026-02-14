import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.js";
import { uploader } from "../utils/multerUtil.js";

import { productDBManager } from "../dao/productDBManager.js";
import ProductRepository from "../repositories/product.repository.js";
import ProductsService from "../services/products.service.js";

const router = Router();


const productDAO = new productDBManager();
const productRepository = new ProductRepository(productDAO);
const productsService = new ProductsService(productRepository);

router.get("/", async (req, res) => {
  const result = await productsService.getProducts(req.query);

  res.json({
    status: "success",
    payload: result,
  });
});
router.get("/:pid", async (req, res) => {
  try {
    const result = await productsService.getProductById(req.params.pid);

    res.json({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  uploader.array("thumbnails", 3),
  async (req, res) => {
    if (req.files) {
      req.body.thumbnails = req.files.map((file) => file.path);
    }

    try {
      const result = await productsService.createProduct(req.body);

      res.status(201).json({
        status: "success",
        payload: result,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
);
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  uploader.array("thumbnails", 3),
  async (req, res) => {
    if (req.files) {
      req.body.thumbnails = req.files.map((file) => file.filename);
    }

    try {
      const result = await productsService.updateProduct(
        req.params.pid,
        req.body
      );

      res.json({
        status: "success",
        payload: result,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
);
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const result = await productsService.deleteProduct(req.params.pid);

      res.json({
        status: "success",
        payload: result,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
);
export default router;
