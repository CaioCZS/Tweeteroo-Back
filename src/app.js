import express from "express"
import cors from "cors"

const server = express()
server.use(express.json())
server.use(cors())
let userAtual
const usuarios = []
const tweets = []

server.post("/sign-up", (req, res) => {
	const { username, avatar } = req.body
	userAtual = { username, avatar }
	if (
		!username ||
    typeof username !== "string" ||
    !avatar ||
    typeof avatar !== "string"
	) {
		return res.sendStatus(400)
	}

	usuarios.push(userAtual)
	res.status(201).send("OK")
})

server.post("/tweets", (req, res) => {
	const { tweet } = req.body
	const { user } = req.headers
	if (!userAtual) {
		return res.status(401).send("UNAUTHORIZED")
	}

	if (!tweet || typeof tweet !== "string") {
		return res.sendStatus(400)
	}
	const newTweet = { username: user, tweet }
	tweets.push(newTweet)

	res.status(201).send("OK")
})

server.get("/tweets", (req, res) => {
	let tweetsFiltrado = []
	if(tweets.length < 11){
		tweets.forEach((t) => {
			const { avatar } = usuarios.find((u) => u.username === t.username)
			const newTweet = {...t , avatar }
			tweetsFiltrado.push(newTweet)
		})
		
	}else{
		for(let i=tweets.length-1 ; i >= tweets.length - 10 ; i--){
			const { avatar } = usuarios.find((u) => u.username === tweets[i].username)
			const newTweet = {...tweets[i] , avatar }
			tweetsFiltrado.push(newTweet)
		}
	}
	
	res.send(tweetsFiltrado)
})

server.listen(5000)
