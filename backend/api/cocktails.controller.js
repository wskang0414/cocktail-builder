import cocktailsDAO from "../dao/cocktailsDAO.js"

export default class CocktailsController {
    static async apiGetCocktails(req, res, next) {
        const cocktailsPerPage = req.query.cocktailsPerPage ? parseInt(req.query, cocktailsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.Ingredients) {
            filters.Ingredients = req.query.Ingredients
        }
        else if (req.query.Image) {
            filters.Image = req.query.Image
        }
        else if (req.query.Num) {
            filters.Num = req.query.Num
        }
        
        const { cocktailsList, totalNumCocktails } = await cocktailsDAO.getCocktails({
            filters,
            page, 
            cocktailsPerPage,
        })

        let response = {
            cocktails: cocktailsList,
            page: page,
            filters: filters,
            entires_per_page: cocktailsPerPage,
            total_results: totalNumCocktails,
        }
        res.json(response)
    }
    static async apiGetIngredients(req, res, next) {
        try {
            let ingredients = await cocktailsDAO.getIngredients()
            res.json(ingredients)
        }

        catch(e) {
            console.log('api, ${e}')
            res.status(500).json({error: e})
        }
    }

    static async apiGetImages(req, res, next) {
        try {
            let images = await cocktailsDAO.getImages()
            res.json(images)
        }

        catch (e) {
            console.log('api, ${e}')
            res.status(500).json({error:e})
        }
    }

    static async apiGetNums(req, res, next) {
        try {
            let nums = await cocktailsDAO.getNums()
            res.json(nums)
        }
        catch(e) {
            console.log('api, ${e}')
            res.status(500).json({error:e})
        }
    }

    static async apiGetNames(req, res, next) {
        try {
            let names = await cocktailsDAO.getNames()
            res.json(names)
        }
        catch (e) {
            console.log('api, ${e}')
            res.status(500).json({error:e})
        }
    }

    static async apiGetCocktailsById(req, res, next) {
        try {
            let id = req.params.id || {}
            let cocktail = await cocktailsDAO.getCocktailsByID(id)
            if (!cocktail) {
                res.status(404).json({error: "Not found"})
                return
            }
            res.json(cocktail)
        }
        catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error})
        }
    }
}