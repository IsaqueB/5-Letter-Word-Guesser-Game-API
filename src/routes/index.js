const express = require("express")
const words = require("./words")

const router = express.Router()

router.use("/", words)

module.exports = router