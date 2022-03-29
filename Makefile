collect:
	node ./src/scripts/collect_words/ime_usp.js
	node ./src/scripts/collect_words/wikwik.js
	node ./src/scripts/collect_words/merge.js

run:
	node ./src/index.js

dev:
	nodemon ./src/index.js