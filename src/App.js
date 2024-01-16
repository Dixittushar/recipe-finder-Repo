import styled from "styled-components";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import {
  Header,
  AppIcon,
  AppNameComponent,
  SearchComponent,
  SearchIcon,
  SearchInput,
  Container,
} from "./components/HeaderComponent";

import {
  RecipeContainer,
  RecipeListContainer,
  RecipeName,
  CoverImage,
  IngredientsText,
  SeeMoreText,
} from "./components/RecipeComponent";
import { useState } from "react";

// const APP_ID = "a278c77e";
// const APP_KEY = "fea5e9031aa387b538a86c23e1b54c3d";
const APP_ID = process.env.REACT_APP_EDAMAM_APP_ID;
const APP_KEY = process.env.REACT_APP_EDAMAM_APP_KEY;

const PlaceHolder = styled.img`
  width: 120px;
  height: 120px;
  margin: 200px;
  opacity: 50%;
`;

const RecipeComponent = (props) => {
  const [show, setShow] = useState(false);
  // console.log("props", props);
  const { recipeObj } = props;
  return (
    <RecipeContainer>
      <Dialog open={show}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Ingredients
        </DialogTitle>
        <DialogContent>
          <RecipeName>{recipeObj.recipe.label}</RecipeName>
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {recipeObj.recipe.ingredients.map((ingredientObj, index) => (
                <tr key={index}>
                  <td>{ingredientObj.text}</td>
                  <td>{ingredientObj.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <IngredientsText onClick={() => window.open(recipeObj.recipe.url)}>
            See More
          </IngredientsText>
          <SeeMoreText onClick={() => setShow(false)}>Close</SeeMoreText>
        </DialogActions>
      </Dialog>

      <CoverImage src={recipeObj.recipe.image} />
      <RecipeName>{recipeObj.recipe.label}</RecipeName>
      <IngredientsText onClick={() => setShow(true)}>
        Ingredients
      </IngredientsText>
      <SeeMoreText onClick={() => window.open(recipeObj.recipe.url)}>
        See Complete Recipe
      </SeeMoreText>
    </RecipeContainer>
  );
};

function App() {
  const [timeOutId, setTimeOutId] = useState();
  const [recipeList, setRecipeList] = useState([]);

  const fetchRecipe = async (searchString) => {
    const response = await axios.get(
      `https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    // console.log(response.data);
    setRecipeList(response.data.hits);
  };

  const onTextChange = (event) => {
    clearTimeout(timeOutId);
    const timeOut = setTimeout(() => {
      fetchRecipe(event.target.value);
    }, 500);
    setTimeOutId(timeOut);
  };
  return (
    <Container>
      <Header>
        <AppNameComponent>
          <AppIcon src="logo.svg" />
          Recipe Finder
        </AppNameComponent>
        <SearchComponent>
          <SearchIcon src="/searchicon.svg" />
          <SearchInput placeholder="Search Recipe" onChange={onTextChange} />
        </SearchComponent>
      </Header>
      <RecipeListContainer>
        {recipeList.length ? (
          recipeList.map((recipeObj, index) => (
            <RecipeComponent key={index} recipeObj={recipeObj} />
          ))
        ) : (
          <PlaceHolder src="logo.svg" />
        )}
      </RecipeListContainer>
    </Container>
  );
}

export default App;
