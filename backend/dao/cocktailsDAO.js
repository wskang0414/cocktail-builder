import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let cocktails

export default class cocktailsDAO {

    // initially connect to database
    static async injectDB(conn) {
        if (cocktails) {
            return
        }
        try {
            cocktails = await conn.db(process.env.COCK_NS).collection("data")
        }

        catch (e) {
            console.error('Unable to establish a collection handle in restaurantDAO: ${e}',)
        }
    }

    static async getCocktails({
        filters = null,
        page = 0,
        cocktailsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("Ingredients" in filters) {
                query = { "Ingredients": { $eq: filters["Ingredients"] } }
            }
            else if ("Image" in filters) {
                query = {"Image": {$eq: filters["Image"]}}
            }
            else if ("Num" in filters) {
                query = {"Num": {$eq: filters["Num"]}}
            }
        }
        let cursor

        try {
            cursor = await cocktails.find(query)
        }
        catch(e) {
            console.error('Unable to issue find command, ${e}')
            return { cocktailsList: [], totalNumCocktails: 0}
        }

        const displayCursor = cursor.limit(cocktailsPerPage).skip(cocktailsPerPage * page)

        try {
            const cocktailsList = await displayCursor.toArray()
            const totalNumCocktails = await cocktails.countDocuments(query)
            return { cocktailsList, totalNumCocktails }
        } 
        catch (e) {
            console.error('Unable to convert cursor to array or problem counting documents, ${e}',)
            return { cocktailsList: [], totalNumCocktails: 0 }
        }
    }

    static async getNames() {
        let names = []
        try {
            names = await cocktails.distinct("Cocktail")
            return names
        }
        catch(e) {
            console.error('Unable to get names, ${e}')
            return names
        }
    }

    static async getIngredients() {
        let ingredients = []
        try {
            ingredients = await cocktails.distinct("Ingredients")
            return ingredients
        }
        catch(e) {
            console.error('Unable to get ingredients, ${e}')
            return ingredients
        }
    }
    static async getNums() {
        let nums = []
        try {
            nums = await cocktails.distinct("Num")
            return nums
        }
        catch(e) {
            console.error('Unable to get nums, ${e}')
            return nums
        }
    }

    static async getImages() {
        let images = []
        try {
            images = await cocktails.distinct("Image")
            return images
        }
        catch(e) {
            console.error('Unable to get images, ${e}')
            return images
        }
    }

    static async getCocktailsByID(id) {
        try {
          const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
                  {
                      $lookup: {
                          from: "reviews",
                          let: {
                              id: "$_id",
                          },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: {
                                          $eq: ["$cocktails_id", "$$id"],
                                      },
                                  },
                              },
                              {
                                  $sort: {
                                      date: -1,
                                  },
                              },
                          ],
                          as: "reviews",
                      },
                  },
                  {
                      $addFields: {
                          reviews: "$reviews",
                      },
                  },
              ]
          return await cocktails.aggregate(pipeline).next()
        } catch (e) {
          console.error(`Something went wrong in getRestaurantByID: ${e}`)
          throw e
        }
      }
}
