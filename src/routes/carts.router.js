import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.js";
import { CartService } from "../services/carts.service.js";

const router = Router();
const cartService = new CartService();
router.get("/:cid", async (req, res) => {
  try {
    const result = await cartService.getCartById(req.params.cid);

    res.json({
      status: "success",
      payload: result
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const result = await cartService.createCart();

    res.status(201).json({
      status: "success",
      payload: result
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const result = await cartService.addProductToCart(
        req.params.cid,
        req.params.pid
      );

      res.json({
        status: "success",
        payload: result
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }
);
router.delete(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const result = await cartService.removeProductFromCart(
        req.params.cid,
        req.params.pid
      );

      res.json({
        status: "success",
        payload: result
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }
);
router.put(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const result = await cartService.updateCartProducts(
        req.params.cid,
        req.body.products
      );

      res.json({
        status: "success",
        payload: result
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }
);
router.put(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const result = await cartService.updateProductQuantity(
        req.params.cid,
        req.params.pid,
        req.body.quantity
      );

      res.json({
        status: "success",
        payload: result
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }
);
router.delete(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const result = await cartService.clearCart(req.params.cid);

      res.json({
        status: "success",
        payload: result
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }
);
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const result = await cartService.purchaseCart(
        req.params.cid,
        req.user
      );

      res.json({
        status: "success",
        payload: result
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }
);
export default router;
