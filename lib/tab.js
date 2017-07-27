const blessed = require('blessed')

// We extend the screen and make our own "tab" as to allow us to not have to think about GUI at all.
class tab extends blessed.box {
	constructor(type, connection, parent) {
		super()

		this.title = `eidolon $(type)`

		let main = blessed.list({
			top: 0,
			left: 0,
			content: 'loading...',
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
			content: 'loading...',
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
			keys: 'vi',
			color: 'white',
			width: '70%',
			height: '8%',
			border: {
				type: 'line'
			},
			style: {
				scrollbar: true,
				fg: 'white',
				focus: {
					bg: 'blue'
				},
				border: {
					fg: '#f0f0f0'
				}
			}

		})

		this.main = main
		this.button = button
		this.userlist = userlist
		this.text = text
		button.addListener('click', _ => send('send', text.getValue()))
		this.append(main)
		this.append(userlist)
		this.append(button)
		this.append(text)
		this.connection = connection


		text.addListener('submit', _ => {
			this.handleIn(text.getValue())
		})

		text.key('C-z', _ => {
			this.handleIn(text.getValue())
		})
		//this.main.content = 'test'
		connection.on("ready", data => {
			//this.main.content = "Connection established"
			connection.nick()})
		connection.on("message", data => {
			this.main.content += data
			this.userlist.content = data
		})
		
}

	
handleIn(data) {
	if (data.match("!reply")) {
		let match = data.match(/\d+/)
		return send('send', { "content": data.substring(9), "parent": repliables[data.match(/\d+/)[0]] })
	}
	if (data.match("!who"))
		return send('who')
	this.connection.post(data)

}



}
module.exports = tab
