const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {buildSchema} = require('graphql');

// 
const schema = buildSchema(`

  input ProductInput {
    name : String,
    price: Int
    description : String
  }

  type Product {
    id: ID!,
    name: String,
    price: Int,
    description: String
  }

  type Query{
    getProduct(id:ID!) : Product
  }

  type Mutation{
    addProduct(input : ProductInput) : Product,
    updateProduct (id: ID!, input: ProductInput!) : Product,
    deleteProduct (id: ID!) : String
  }
`);

const products = [
  {
    id: 1, 
    name : '1번',
    price: 1000,
    description: '1번 제품 정보입니다.'
  },
  {
    id: 2, 
    name : '2번',
    price: 2000,
    description: '2번 제품 정보입니다.'
  }
]

const root = {
  getProduct : ({id}) => products.find(product => product.id === parseInt(id)),
  addProduct : ({input}) => {
    input.id = parseInt(products.length+1);
    products.push(input);
    return root.getProduct({id:input.id})
  },
  updateProduct: ({id, input}) => {
    const index = products.findIndex(product => product.id === parseInt(id));
    products[index] = {
      id: parseInt(id),
      ...input
    } 
    return products[index];
  },
  deleteProduct : ({id, input}) =>{
    const index = products.findIndex(product => product.id === parseInt(id));
    products.splice(index, 1);
    return "remove success";
  }
}

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue : root,
  graphiql : true // gui 제공
}));


app.use('/static', express.static('static'));

app.listen( 4000, ()=>{
  console.log('running server port 4000');
})