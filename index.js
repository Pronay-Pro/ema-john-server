const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0s4gz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json())
app.use(cors())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaJohnShop").collection("products");
  const orderCollection = client.db("emaJohnShop").collection("orders");
  app.post('/addProducts',(req, res) => {
      const allProduct = req.body;
      products.insertOne(allProduct)
      .then(result =>{
          console.log(result.insertedCount)
          res.send(result.insertedCount);
      })
      
  })
  app.get('/products',(req, res)=>{
      products.find({})
      .toArray((err,documents)=>{
        res.send(documents)
      })
  })
  app.get('/product/:key',(req, res)=>{
      products.find({key:req.params.key})
      .toArray((err,documents)=>{
        res.send(documents[0])
      })
  })
  app.post('/productByKeys',(req, res)=>{
    const productsKey = req.body;
    products.find({key:{$in:productsKey}})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  app.post('/addOrders',(req, res) => {
    const allOrders = req.body;
    orderCollection.insertOne(allOrders)
    .then(result =>{
        console.log(result.insertedCount)
        res.send(result.insertedCount>0);
    })
    
})
 
});

app.get('/', (req, res)=> {
  res.send('hello world')
})

app.listen(process.env.PORT||5000)