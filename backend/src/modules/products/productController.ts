import type { Request, Response } from "express";
import { ProductService } from "./productService.js";

export class ProductController {
  static async create(req: Request, res: Response) {
    try {
      const {
        name, price, description, category,
        region, availableQuantity, minOrderQuantity,
        qualityGrade, isOrganic, harvestDate, isSoldOut
      } = req.body;
      // @ts-ignore
      const farmerId = req.user.id;

      let imagePaths: string[] = [];
      let videoPath: string | undefined = undefined;

      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files["images"] && files["images"].length > 0) {
          imagePaths = files["images"].map(f => f.path);
        }
        if (files["video"] && files["video"].length > 0 && files["video"][0]) {
          videoPath = files["video"][0].path;
        }
      }

      const product = await ProductService.createProduct({
        farmerId,
        name,
        price: parseFloat(price),
        description,
        category,
        imagePaths,
        videoPath,
        region,
        availableQuantity: availableQuantity !== undefined ? parseInt(availableQuantity) : undefined,
        minOrderQuantity: minOrderQuantity !== undefined ? parseInt(minOrderQuantity) : undefined,
        qualityGrade,
        isOrganic: isOrganic === 'true' || isOrganic === true,
        harvestDate: harvestDate ? new Date(harvestDate) : undefined,
        isSoldOut: isSoldOut === 'true' || isSoldOut === true
      });
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      // Pass the entire query object to the service to handle V2 complex filters
      const products = await ProductService.getAllProducts(req.query);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "Missing id" });
      const product = await ProductService.getProductById(id);
      if (!product) return res.status(404).json({ error: "Not found" });
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "Missing id" });
      const {
        name, price, description, category,
        region, availableQuantity, minOrderQuantity,
        qualityGrade, isOrganic, harvestDate, isSoldOut,
        imageOrder // V2: Array of existing URLs in new order
      } = req.body;

      let imagePaths: string[] = [];
      let videoPath: string | undefined = undefined;

      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files["images"] && files["images"].length > 0) {
          imagePaths = files["images"].map(f => f.path);
        }
        if (files["video"] && files["video"].length > 0 && files["video"][0]) {
          videoPath = files["video"][0].path;
        }
      }

      const product = await ProductService.updateProduct(
        id,
        name,
        price !== undefined ? parseFloat(price) : undefined,
        description,
        category,
        imagePaths,
        videoPath,
        isSoldOut !== undefined ? (isSoldOut === "true" || isSoldOut === true) : undefined,
        region,
        availableQuantity !== undefined ? parseInt(availableQuantity) : undefined,
        minOrderQuantity !== undefined ? parseInt(minOrderQuantity) : undefined,
        qualityGrade,
        isOrganic === "true" || isOrganic === true,
        harvestDate ? new Date(harvestDate) : undefined,
        imageOrder ? JSON.parse(imageOrder) : undefined // Pass the order
      );
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async remove(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "Missing id" });
      await ProductService.deleteProduct(id);
      res.json({ message: "Product deleted" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}