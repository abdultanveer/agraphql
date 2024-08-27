// fetch(" http://localhost:5000/graphql", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify({ query: "{ hello }" }),
//   })
//     .then(r => r.json())
//     .then(data => console.log("data returned:", data))

var dice = 3
var sides = 6
var query = /* GraphQL */`query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`


fetch("http://localhost:5000/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    query,
    variables: { dice, sides },
  }),
})
  .then(r => r.json())
  .then(data => console.log("data returned:", data))



//   {
//     rollDice(numDice: 3, numSides: 6)
//   }