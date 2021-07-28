import express from "express"
import CocktailsController from "./cocktails.controller.js"

const router = express.Router()

router.route("/").get(CocktailsController.apiGetCocktails)
router.route("/names").get(CocktailsController.apiGetNames)
router.route("/ingredients").get(CocktailsController.apiGetIngredients)
router.route("/images").get(CocktailsController.apiGetImages)
router.route('/id/:id').get(CocktailsController.apiGetCocktailsById)
router.route('/nums').get(CocktailsController.apiGetNums)


export default router