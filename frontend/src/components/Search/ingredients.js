import React, {useState, useEffect }from "react";
import CocktailsDataService from "../../services/cocktails.js"
import './suggestions.css';
import { Helmet } from 'react-helmet';

const CocktailsList = props => {
    const [cocktails, setCocktails] = useState([]);
    const [searchIngredients, setSearchIngredients] = useState('')
    const [ingredients, setIngredients] = useState([])
    const [suggestions, setSuggestions] = useState([])           

    useEffect(() => {
        retreiveIngredients();
    }, [])

    const onChangeSearchIngredients = e => {
        let matches = []
        const searchIngredients = e.target.value
        if (searchIngredients.length > 2) {
            matches = ingredients.filter(ingredient => {
                const regex = new RegExp(`${searchIngredients}`, 'gi');
                return ingredient.match(regex)
            })
        }
        console.log('matches', matches)
        setSuggestions(matches);
        setSearchIngredients(searchIngredients)
    } 

    const onSuggestHandler = (searchIngredients) => {
        setSearchIngredients(searchIngredients)
        setSuggestions([])
    }

    const retreiveIngredients = () => {
        CocktailsDataService.getIngredients()
        .then(response => {
            console.log(response.data);
            setIngredients(response.data)
        })
    }
    const find = (query, by) => {
        CocktailsDataService.find(query, by).then(response => {
            console.log(response.data);
            setCocktails(response.data.cocktails);
        })
        .catch(e => {
            console.log(e);
        })
    }

    const findByIngredients = () => {
        find(searchIngredients, "Ingredients")
    };

    return (
        <div>
            <Helmet>
            <style>{'body {background-color: orange; }'}</style>
            </Helmet>
            <div className="float-container">
                <div className="float-child" style={{width: 600}}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by ingredient"
                        value={searchIngredients}
                        onChange={onChangeSearchIngredients} 
                        onBlur={() => {
                            setTimeout(() => { 
                                setSuggestions([])
                            }, 100)
                        }} />
                        {suggestions && suggestions.map((suggestion, i) =>
                        <div key={i} className="suggestion col-md-12 justify-content-md-center" 
                        onClick={() => onSuggestHandler(suggestion)}>
                            {suggestion}</div>
                        )}
                    </div>
                <div className="float-child">
                    <button
                        className="Button btn btn-outline-secondary"
                        type="button"
                        onClick={findByIngredients} >
                            Search
                    </button>
                </div>
                </div>
              <br/> <br/>
            <div>
            <div className="row">
                {cocktails.map((cocktail) => {
                    return (
                        <div className="col-md-4">
                            <div className="BeerListItem-main-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title"> {cocktail.Cocktail}</h5>
                                        <img src={'https://uk.thebar.com' + cocktail.Image} 
                                        alt="cocktail"
                                        className="BeerListItem-img"/>
                                        <p className="card-text">
                                            <strong>Ingredients: </strong>{cocktail.Ingredients.join(', ')} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}

export default CocktailsList
