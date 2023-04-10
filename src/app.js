import express from "express"
import cors from "cors"

const server = express()
server.use(express.json())
server.use(cors())

const usuarios = []
const tweets = []

server.post("/sign-up", (req, res) => {
	const { username, avatar } = req.body
	if (
		!username ||
    typeof username !== "string" ||
    !avatar ||
    typeof avatar !== "string"
	) {
		return res.status(400).send("Todos os dados são obrigatórios!")
	}
	usuarios.push({ username, avatar })
	res.status(201).send("OK")
})

server.post("/tweets", (req, res) => {
	const { tweet } = req.body
	const { user } = req.headers

	if (!tweet || typeof tweet !== "string" || !user ) {
		return res.status(400).send("Todos os dados são obrigatórios!")
	}
	const usuarioCadastrado = usuarios.find((u) => u.username === user)
	if (!usuarioCadastrado) return res.status(401).send("UNAUTHORIZED")

	const newTweet = { username: user, tweet }
	tweets.push(newTweet)

	res.status(201).send("OK")
})

server.get("/tweets", (req, res) => {
	const tweetsFiltrado = []
	const  page  = Number(req.query.page)

	if( page < 1){
		return res.status(400).send("Informe uma página válida!")
	}

	if (tweets.length < 11) {
		tweets.forEach((t) => {
			const ttUser = usuarios.find((u) => u.username === t.username)
			const newTweet = { ...t, avatar: ttUser.avatar }
			tweetsFiltrado.push(newTweet)
		})
	} else { 
		const pag = page ? page : 1 
		const aux = page ? (page - 1)*10 : 0 

		for (let i = tweets.length - (1+aux); i >= tweets.length - (10*pag); i--) {
			if(!tweets[i]){
				continue
			}
			const ttUser = usuarios.find((u) => u.username === tweets[i].username)
			const newTweet = { ...tweets[i], avatar: ttUser.avatar }
			tweetsFiltrado.push(newTweet)
		}
	}

	res.send(tweetsFiltrado)
})

server.get("/tweets/:USERNAME", (req, res) => {
	const tweetsFiltrado = []
	const { USERNAME } = req.params

	if (!usuarios.find((u) => u.username === USERNAME)) {
		return res.send([])
	}

	const tweestUsuario = tweets.filter((t) => t.username === USERNAME)
	const { avatar } = usuarios.find((u) => u.username === USERNAME)
	tweestUsuario.forEach((t) => {
		const newTweet = { ...t, avatar }
		tweetsFiltrado.push(newTweet)
	})
	return res.send(tweetsFiltrado)
})

server.listen(5000)
