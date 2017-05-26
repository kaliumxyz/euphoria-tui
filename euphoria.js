'use strict'
// const log = e => require('k-log')(e + "\n", "euphoria-cli.log",true)
const WebSocket = require('ws')
const color = require("./lib/color")
const gui = require('./lib/gui')
const screen = new gui
const euphoriaConnection = require('euphoria-connection')
const conn = new euphoriaConnection('test', 1, false)


let reply = 0

let repliables = []

let nicklist

let flag

let room = process.argv[2] || "test"

const ws = new WebSocket(`wss://euphoria.io/room/${room}/ws?h=1`, {
	origin: 'https://euphoria.io'
})

function send (type, data) {
	if(data)
		data = ', "data":' + JSON.stringify(data)
	else
		data = ''
	ws.send(`{
		"type": "${type}"
		${data}
		}`)
}

function download(before) {
	if (before)
		// return send("log",{n:1000,"before": before})
		send("log", { n: 1000 })
}

function nick(nick) {
	nick = nick || "K"
	send('nick', { "name": nick })

}
ws.on('open', function open() {
	screen.main.content = 'connected'
	screen.render()
	nick()
	// let pew = setTimeout(_=>send('send',{"content":"test"}),1900)
	// send('who')
	// let pew = setTimeout(download, 1000)
})

ws.on('close', function close() {
	screen.main.content = 'disconnected'
})

ws.on('message', function incoming(data) {
	// log(data)
	let dt = JSON.parse(data)
	if (dt.type === "ping-event") {
		send("ping-reply", { "time": dt.data.time })
		// log('ping replied')
	}
	if (dt.type === "log-reply") {
		// log(JSON.stringify(dt.data.log))
		// dt.data.log.forEach(item => log(JSON.stringify(item.content)+'\n',true))
		let pew = setTimeout(_ => download(dt.data.log[0].id), 200)
	}
	if (dt.type === "send-event") {
		repliables[reply++] = dt.data.id
		// log(reply++ + dt.data.content)
		if (dt.data.content.match('!help @K')) {
			send('send', { "content": "This is the real @K, a real person.", "parent": dt.data.id }
			)
		}
		if (dt.data.content.match('!kill @K')) {
			send('send', { "content": "kthxbye", "parent": dt.data.id })
			process.exit()
		}
		if (dt.data.content.match('@K')) {
			// notify?
		}
		// clearTimeout(pew)
		if(dt.sender)
		screen.main.add(`{#${color(dt.sender.name)}bg}${dt.sender.name}{/} {left}${dt.content}{left}\n`)
		// let pew = setTimeout(_=>send('send',{"content":"pewpewpew"}),590000)
	}
	if (dt.type === "who-reply") {
		dt.data.listing.forEach(e => e = (`{#${color(e.name)}bg}${e.name}{/} {left}${e.id}{left}\n`))
	}
	if (dt.type === "snapshot-event") {
		screen.userlist.clearItems()
		dt.data.listing.forEach(e => screen.userlist.add(`{${color(e.name)}-fg}${e.name}{/} ${e.id}\n`))
		screen.main.clearItems()
		dt.data.log.forEach(e => screen.main.add(`{${color(e.sender.name)}-fg}${e.sender.name}{/}:	${e.content}\n`))
	}
	screen.render()

})

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