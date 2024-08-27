var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var { ruruHTML } = require("ruru/server")

 
//npm install --save ruru

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    rollDice(numDice: Int!, numSides: Int): [Int]

  }
`)
 
// The root provides a resolver function for each API endpoint
var root = {
  hello() {
    return "Hello world!"
  },
  rollDice(args) {
    var output = []
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)))
    }
    return output
  },

}
 
var app = express()
 
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);
// Create and use the GraphQL handler.
 
// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})
 
// Start the server at port
app.listen(5000)
console.log("Running a GraphQL API server at http://localhost:5000/graphql")