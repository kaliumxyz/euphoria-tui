const blessed = require('blessed')

class gui extends blessed.screen {
	constructor() {
		super({smartCSR: true})

		this.title = 'eidolon - euphoria'

		let main = blessed.list({
			top: '0',
			left: '0',
			content: 'loading',
			width: '70%',
			scrollable: true,
			height: '94%',
			tags: true,
			border: {
				type: 'line'
			},
			style: {
				fg: 'white',
				scrollbar: true,
				border: {
					fg: '#f0f0f0'
				}
			}
		})

		let bar = blessed.listbar({
			top: '0',
			width: '100%',
			height: '4%',
			style: {
				bg: 'white'
			}
		})

		let button = blessed.listbar({
			bottom: 0,
			right: 0,
			width: '30%',
			height: '8%',
			border: {
				type: 'line'
			},
			style: {
				scrollbar: true,
				fg: 'white',
				border: {
					fg: '#f0f0f0'
				}
			}
		})

		let userlist = blessed.list({
			top: '0',
			right: '0',
			content: 'loading',
			width: '30%',
			height: '94%',
			tags: true,
			border: {
				type: 'line'
			},
			style: {
				scrollbar: true,
				fg: 'white',
				border: {
					fg: '#f0f0f0'
				}
			}
		})

		let text = blessed.textarea({
			bottom: 0,
			left: 0,
			// keys: 'vi',
			// vi: true,
			color: 'white',
			width: '70%',
			height: '8%',
			border: {
				type: 'line'
			},
			style: {
				scrollbar: true,
				fg: 'white',
				border: {
					fg: '#f0f0f0'
				}
			}

		})

		this.main = main
		this.bar = bar
		this.button = button
		this.userlist = userlist
		button.addListener('click', _ => send('send', text.getValue()))
		// Append our box to the screen.
		this.append(main)
		this.append(userlist)
		this.append(text)
		// screen.append(bar)
		this.append(button)

		// Quit on Escape, q, or Control-C.
		this.key(['escape', 'q', 'C-c'], function (ch, key) {
			return process.exit(0)
		})

		// screen.key('C-z', function(ch, key) {
		// 	return send('send',{"content":  `${text.getValue()}`})
		// })
		// Focus our element.
		text.focus()

		text.addListener('submit', _ => send('send', this.getValue()))
		text.key('C-z', _ => {
			return send('send', { "content": `${text.getValue()}` })
		})
		// Render the screen.
		this.render()
	}


}


module.exports = gui 