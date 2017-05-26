const ws = require('ws')

class connection extends ws {
	constructor (room = 'welcome', uri = 'instant.leet.nu', options = {origin: 'instant.leet.nu'}) {
		super(uri + '/room/' + room, options)
		this.room = room
	}
	
}
