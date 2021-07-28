import http from "../http-common";

class CocktailsDataService {
    getAll(page = 0) {
        return http.get(`?page=${page}`)
    }

    get(id) {
        return http.get(`/id/${id}`);
    }

    find(query, by = "Cocktail", page = 0) {
        return http.get(`?${by}=${query}&page=${page}`);
    }

    getIngredients(id) {
        return http.get('/ingredients');
    }

    getData() {
        return http.get("/")
    }

    getNums(id) {
        return http.get('/nums')
    }

}

export default new CocktailsDataService();