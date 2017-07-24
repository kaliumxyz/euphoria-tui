'use strict'
// fix the default logging pluging, thx.
// const log = e => require('k-log')(e + "\n", "euphoria-cli.log",true)
const WebSocket = require('ws')
const color = require('./lib/color')
const tab = require('./lib/tab')
const blessed = require('blessed')

// Adding the main screen, we will append the tabs to it.

let main = blessed.screen({smartCSR: true})

/* Connection types below */
const euphoriaConnection = require('euphoria-connection')
const instantConnection = require('instant-connection')
// I would like to add discord and IRC.




let test1 = new tab("euphoria", new euphoriaConnection())

main.append(test1)


// Quit on Escape or Control-C.
main.key(['escape', 'C-c'], function (ch, key) {
	return process.exit(0)
})

main.render()

setInterval( _ => {main.render()}, 100)

