
import { Router } from "express";
import { Sample_Foods, Sample_Tags } from "../data";
import asyncHandler from 'express-async-handler';
import { FoodModel } from "../models/food.model";

const router = Router()

router.get('/seed', asyncHandler(
  async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send('seed is already done');
    }
    await FoodModel.create(Sample_Foods);
    res.send("seed is done");
}

) );

router.get('/', asyncHandler(
  async (req, res) => {
    const foods = await FoodModel.find()
    res.send(foods);
}
));

router.get("/search/:searchTerm", (req, res) => {
   const searchTerm = req.params.searchTerm as string;
    const filteredFoods = Sample_Foods.filter(food =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
     );
     res.send(filteredFoods);
});

router.get("/tags", (req,res)=>
{
    res.send(Sample_Tags);
})

router.get("/:foodId", (req, res) => {
  const foodId = req.params.foodId;
    const food = Sample_Foods.find(food => food.id === foodId);
    if (food) {
        res.send(food);
    }
    else {
        res.status(404).send({ message: "Food not found" });
    }
});

router.get("/tag/:tagName", (req, res) => {
  const tagName = req.params.tagName.toLowerCase();
  const filteredFoods = Sample_Foods.filter(food =>
    food.tags?.some((tag: string) => tag.toLowerCase() === tagName)
  );
  res.send(filteredFoods);
});

export default router;
