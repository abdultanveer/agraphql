var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var { ruruHTML } = require("ruru/server")
const { booksCollectionPromise } = require("./Mongodb")

 
//npm install --save ruru

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    rollDice(numDice: Int!, numSides: Int): [Int]
    getBooks:[Book]
    getMessage:String
  }

type Book{
  title:String
  author:String
}
   type Mutation{
      setMessage(message: String):String
      addBook(title: String!, author: String!): Book

    }

`)

let message = "hello ascendion"


const books = [
  {title: 'let us c', author:'kanetkar'},
  {title: 'let us c++', author:'yash kanetkar'},

]
 
// The root provides a resolver function for each API endpoint
var root = {
  hello() {
    return "Hello world!"
  },

  //getBooks: ()=> books,


  getBooks: async () => {
    const booksCollection = await booksCollectionPromise;
    return booksCollection.find().toArray();
  },
  addBook: async ({ title, author }) => {
    const booksCollection = await booksCollectionPromise;
    const newBook = { title, author };
    await booksCollection.insertOne(newBook);
    return newBook;
  },

  getMessage: () => message,
  setMessage: ({message:newMessage}) =>{
    message = newMessage;
    return message;
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