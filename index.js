'use strict'
// fix the default logging pluging, thx.
// const log = e => require('k-log')(e + "\n", "euphoria-cli.log",true)
const WebSocket = require('ws')
const color = require('./lib/color')
const tab = require('./lib/tab')
const blessed = require('blessed')

const program = require('gitlike-cli')
program.parse(process.argv)

// Adding the main screen, we will append the tabs to it.

let main = blessed.screen({smartCSR: true})

/* Connection types below */
const euphoriaConnection = require('euphoria-connection')
const instantConnection = require('instant-connection')
// I would like to add discord and IRC.

// an Array to prevent the tabs from being garbage collected when they are not active.
const tabs = []

// on ctrl + r, create an instant tab.
main.key(['C-r'], function (ch, key) {
	if(tabs[0])
		main.remove(tabs[tabs.length-1])
	tabs.push(new tab("instant", new instantConnection()))
	main.append(tabs[tabs.length-1])
})

// on ctrl + e, create an instant tab.
main.key(['C-e'], function (ch, key) {
	if(tabs[0])
		main.remove(tabs[tabs.length-1])
	tabs.push(new tab("euphoria", new euphoriaConnection()))
	main.append(tabs[tabs.length-1])
})

// Allow switching windows with 0 to 9
for(let i = 0; i<10; i++) {
	main.key(['' + i], _ => {
		if(tabs[i]) {
			main.remove(main.children[0])
			main.append(tabs[i])
			tabs[i].children[0].focus()
		}

	})
}

// Quit on Escape or Control-C.
main.key(['escape', 'C-c'], function (ch, key) {
	return process.exit(0)
})

// Add a nice placeholder screen.
main.append(
	blessed.box({
		top: '0',
		left: '0',
		color: 'blue',
		valign: 'middle',	
		align: 'center',
		width: '100%',
		height: '100%',
		content: 
`
00000000000000000
000000000000000000000
00000000000000000000000
00000000000000000000000
00000000000000000000000
00000000000000000000000
00                   00
000                 000
0000               0000
0000           0000
000000000000000
`,
		style: {
			fg: 'blue'}
	}))

// Render the main screen.
main.render()

// Render it again every 33ms, so that we can see changes.
setInterval( _ => main.render(), 33)

