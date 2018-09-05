const blessed = require('blessed')

class tab extends blessed.Box {
	constructor(room, connection, parent) {
		super({
			keys: true,
			vi: true,
			mouse: true,
		});

		this.title = `euphoria-TUI`;

		let main = blessed.List({
			parent: this,
			top: 0,
			left: 0,
			width: '100%',
			keys: true,
			vi: true,
			mouse: true,
			scrollable: true,
			height: '94%',
			tags: true,
			label: `{bold}{blue-bg}&${room}{/blue-bg}{/bold}`,
			border: {
				type: 'line'
			},
			style: {
				focus: {
					bg: 'blue'
				},
				fg: 'white',
				scrollbar: true,
				border: {
					fg: '#f0f0f0'
				}
			}
		})

		let button = blessed.ListBar({
			parent: this,
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

		let userlist = blessed.List({
			parent: this,
			top: '0',
			right: '0',
			width: '30%',
			height: '94%',
			tags: true,
			label: `{bold}users{/bold}`,
			vi: true,
			mouse: true,
			keys: true,
			scrollable: true,
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

		let text = blessed.Textarea({
			parent: this,
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
		this.connection = connection


		text.addListener('submit', _ => {
			this.handleIn(text.getValue())
		})

		text.key('C-z', _ => {
			this.handleIn(text.getValue())
		})

		connection.on('ready', json => {
			connection.nick()
			connection.download(20)
			connection.who()
		})
		connection.on('send-event', json => {
			// this.main.content += json.data
			// this.main.render()
		})
		connection.on('log-reply', json => {
			const data = json.data;
			this.main.setItems(data.log.map(post => post.content));
			this.render();
		})
		connection.on('who-reply', json => {
			const data = json.data;
			this.userlist.setItems(data.listing.map(user => user.name));
			this.userlist.move(1);
			this.render();
		})
		
}

	
handleIn(data) {
	if (data.match("!reply")) {
		let match = data.match(/\d+/)
		return send('send', {
			"content": data.substring(9),
			"parent": repliables[data.match(/\d+/)[0]]
		})
	}
	if (data.match("!who"))
		return connection.who()
	this.connection.post(data)

}



}
module.exports = tab
