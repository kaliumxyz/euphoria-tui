'use strict';
const color = require('euphoria-color');
const tab = require('./views/tab');
const blessed = require('blessed');

// Adding the screen, we will append the tabs to it
let screen = blessed.screen();

/* connections */
const {Bot} = require('euphoria.js');
// const InstantConnection = require('instant-connection');

// allows the user to override any setting in the config file by affixing --{setting} {option} when calling the script 
const args = process.argv
      .join()
      .match(/-\w+,\w+/g) || [];
args.forEach( arg => {
    let key = arg
        .split(',')[0]
        .replace('-','');
    config[key] = arg.split(',')[1];
});

// on ctrl + r, create an instant tab.
// screen.key(['C-r'], function () {
// 	screen.append(new tab("instant", new InstantConnection()))
// })

// on ctrl + e, create an euphoria tab.
screen.key(['C-e'], function () {
    screen.append(new tab('test', new Bot("TUI", "test")));
    screen.render();
});

// Allow switching windows with 0 to 9
for(let i = 0; i<10; i++) {
    screen.key(['' + i], _ => {
        if(tabs[i]) {
            screen.children.forEach(
                child => x.hide()
            );
            screen.children[i].show();
            screen.children[i].focus();
        }

    });
}

// Quit on Control-C.
screen.key(['C-c'], function (ch, key) {
    return process.exit(0);
});

// Add a nice placeholder screen.
screen.append(
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
█████████████████
█████████████████████
███████████████████████
███████████████████████
███████████████████████
███████████████████████
██                   ██
███                 ███
████               ████
████           ████
███████████████
`,
		    style: {
			      fg: 'blue'}
	  }));

// Render the screen screen.
screen.render();
