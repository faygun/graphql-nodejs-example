var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var fs = require('fs');

var books = JSON.parse(fs.readFileSync('book.json', 'utf8')).books;

var schema = buildSchema(`
    type Query{
        book(isbn:String!): Book
        books(pages: Int): [Book]
    }
    
    type Book{
        isbn: String
        title: String
        subtitle: String
        author: String
        published: String
        publisher: String
        pages: Int
        description: String
        website: String
    }
`)

getBook = (args)=>{
    let isbn = args.isbn;
    return books.filter(book=> {
        return book.isbn == isbn
    })[0]
}

getBookList = (args) => {
    let count = args.pages;
    if(count){
        return books.filter(book=>{
            return book.pages > count;
        })
    }
    else{
        return books;
    }
}

var root = { 
    book:getBook,
    books:getBookList
};
 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));