'use strict'
// const log = e => require('k-log')(e + "\n", "euphoria-cli.log",true)
const WebSocket = require('ws')
const color = require("./lib/color")
const gui = require('./lib/gui')
const screen = new gui
const euphoriaConnection = require('euphoria-connection')
const instantConnection = require('instant-connection')

// dis be all junk ;-;

function handleStdin(data) {
	if (data.match("!reply")) {
		let match = data.match(/\d+/)
		return send('send', { "content": data.substring(9), "parent": repliables[data.match(/\d+/)[0]] })
	}
	if (data.match("!who"))
		return send('who')
	// send('send',{"content": data})
}

// process.stdin.on('data', data => handleStdin(data.toString()))

module.exports = eidolon