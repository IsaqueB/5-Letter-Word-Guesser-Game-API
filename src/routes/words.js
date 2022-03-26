const express = require("express")
const words = require("../controllers/words")

const router = express.Router()

router.get("/compare/:word", words.compare)

module.exports = router