'use strict'
const log = e => require('k-log')(e + "\n", "euphoria-cli.log",true)
const blessed = require('blessed')
const WebSocket = require('ws')

const screen = blessed.screen({
  smartCSR: true
})

screen.title = 'euphoria - cli'

let main = blessed.list({
  top: 'center',
  left: '0',
  content: 'loading',
  width: '60%',
  height: '100%',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    }
  }
})

let userlist = blessed.list({
  top: 'center',
  right: '0',
  content: 'loading',
  width: '40%',
  height: '100%',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#f0f0f0'
    }
  }
})

// Append our box to the screen.
screen.append(main)
screen.append(userlist)

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
})

// Focus our element.
main.focus()

// Render the screen.
screen.render()

let reply = 0

let repliables = []

let nicklist

let flag

let room = process.argv[2]

const ws = new WebSocket(`wss://euphoria.io/room/${room}/ws?h=0`, {
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

function download (before) {
	if (before)
	// return send("log",{n:1000,"before": before})
	send("log",{n:1000})
}

function nick (nick){
	nick = nick || "K"
	send('nick', {"name": nick})

}
ws.on('open', function open() {
	main.content ='connected'
	screen.render()
	nick()
	send('who')
	// let pew = setTimeout(download, 1000)
})

ws.on('close', function close() {
	log('disconnected')
})

ws.on('message', function incoming(data) {
	// log(data)
	let dt = JSON.parse(data)
	if (dt.type === "ping-event"){
		send("ping-reply",{"time": dt.data.time})
		// log('ping replied')
	}
	if (dt.type === "log-reply"){
		log(JSON.stringify(dt.data.log))
		// dt.data.log.forEach(item => log(JSON.stringify(item.content)+'\n',true))
		let pew = setTimeout(_=>download(dt.data.log[0].id), 200)
	}
	if (dt.type === "send-event"){
		repliables[reply] = dt.data.id
		log(reply++ + dt.data.content)
		if(dt.data.content.match('!help @K')){
			send('send', {"content": "This is the real @K, a real person.", "parent": dt.data.id}
			)}
		if(dt.data.content.match('!kill @K')){
			send('send', {"content": "kthxbye", "parent": dt.data.id})
			process.exit()
		}
		if(dt.data.content.match('@K')){
			// notify?
		}
		clearTimeout(pew)
		// let pew = setTimeout(_=>send('send',{"content":"pewpewpew"}),590000)
	}
	if (dt.type === "who-reply"){
		dt.data.listing.forEach(e => e = (`${e.name} ${e.id}\n`))
	}
	if (dt.type === "snapshot-event"){
		userlist.clearItems()
		dt.data.listing.forEach(e => userlist.add(`${e.name} ${e.id}\n`))
		main.clearItems()
		dt.data.log.forEach(e => main.add(`${e.sender.name} ${e.content}\n`))
	}
	screen.render()

})

function handleStdin(data){
	if(data.match("!reply")){
		let match = data.match(/\d+/)
		return send('send',{"content": data.substring(9), "parent": repliables[data.match(/\d+/)[0]]})
	}
	if(data.match("!who"))
	return send('who')
	// send('send',{"content": data})
}

process.stdin.on('data', data => handleStdin(data.toString()))