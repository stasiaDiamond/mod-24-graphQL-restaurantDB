var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description: "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      { name: "Swordfish grill", price: 27 },
      { name: "Roasted Broccoli", price: 11 },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description: "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      { name: "Flatbread", price: 14 },
      { name: "Carbonara", price: 18 },
      { name: "Spaghetti", price: 19 },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description: "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      { name: "Dragon Roll", price: 12 },
      { name: "Pancake roll ", price: 11 },
      { name: "Cod cakes", price: 13 },
    ],
  },
];

var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);

// The root provides a resolver function for each API endpoint
var root = {
  restaurant: (arg) => {
    // Your code goes here
    // This method retrieves a single restaurant based on a provided ID.
    // For simplicity, I'll return the first restaurant found with the matching ID
    return restaurants.find(restaurant => restaurant.id === arg.id);
  },
  restaurants: () => {
    // Your code goes here
    // This method retrieves a list of all restaurants.
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    // This method creates a new restaurant.
    const newRestaurant = {
      id: restaurants.length + 1,
      name: input.name,
      description: input.description,
      dishes: []
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    // This method deletes a restaurant based on the provided ID.
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index === -1) {
      throw new Error("Restaurant not found.");
    }
    restaurants.splice(index, 1);
    return { ok: true };
  },
  editrestaurant: ({ id, name }) => {
    // Your code goes here
    // This method updates a restaurant based on the provided ID.
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index === -1) {
      throw new Error("Restaurant not found.");
    }
    restaurants[index].name = name;
    return restaurants[index];
  },
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + "http://localhost:5500/graphql"));




// QUERY:
// ------------------------------------------------------
// http://localhost:5500/graphql is where GrapohiQL is, write queries in there like this:

// mutation editrestaurants($idd: Int = 1, $name: String = "OLDO") {
//   editrestaurant(id: $idd, name: $name) {
//     name
//     description
//   }
// }

// mutation setrestaurants {
//   setrestaurant(input: {
//     name: "Granite",
//     description: "American",
//   }) {
//     name
//     description
//   }
// }

// mutation deleterestaurants($iid: Int = 1) {
//   deleterestaurant(id: $iid) {
//     ok
//   }
// }

// query getrestaurants {
//   restaurants {
//     name
//     description
//     dishes {
//       name
//       price
//     }
//   }
// }


