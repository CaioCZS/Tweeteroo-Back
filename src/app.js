import express from "express";
import cors from "cors"
const server = express();
server.use(express.json());
server.use(cors())
let user;
const usuarios = [
  {
    username: "bobesponja",
    avatar:
      "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png",
  },
];
const tweets = [
  {
    username: "bobesponja",
    tweet: "Eu amo hambúrguer de siri!",
  },
];

server.post("/sign-up" , (req ,res)=>{
    const {username ,avatar} = req.body
    user = { username , avatar}
    usuarios.push(user)
    res.status(201).send("OK")
})

server.post("/tweets" , (req,res)=>{
    const {username , tweet} = req.body
    if(!user){
       return res.status(401).send("UNAUTHORIZED")
    }
    const newTweet = {username , tweet}
    tweets.push(newTweet) 

    res.status(201).send("OK")
})

server.get("/usu" , (req ,res)=>{
    res.send(tweets)
})

server.listen(5000);
