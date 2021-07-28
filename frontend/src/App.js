import React from "react";
import { Switch, Route, Link} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import CocktailsList from "./components/Search/ingredients";


function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" className="navbar-brand">
           Home
         </a>
         <div className="navbar-nav mr-auto">
           <li className="nav-item">
             <Link to={"/cocktails"} className="nav-link">
               My ingredients
             </Link>
           </li>
           <li className="nav-item">
             <Link to={"/saved"} className="nav-link">
               Saved
             </Link>
           </li>
           </div>
       </nav>

      <Switch>
        <Route exact path={'/cocktails'} component={CocktailsList} />
      </Switch>

    </div>

  );
}

export default App;


