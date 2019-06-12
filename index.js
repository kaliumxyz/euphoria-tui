'use strict';
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
// Allow switching windows with 0 to 9
for(let i = 0; i<10; i++) {
    screen.key([`${i}`], _ => {
        if(screen.children[i]) {
            screen.children.forEach(
                child => child.hide()
            );
            screen.children[i].show();
            screen.children[i].focus();
            screen.render();
        }
    });
}

// Quit on Control-C.
screen.key(['C-c'], function (ch, key) {
    return process.exit(0);
});

// Add a nice placeholder screen.
const home = 
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





press Enter to open a new euphoria tab!
`,
		      style: {
			        fg: 'blue'}});
screen.append(home);

home.key(["C-e"], function(data) {
    screen.append(new tab("test", new Bot("K", "test")));
    screen.render();
});

home.key(['C-t', "enter"], function (key) {
    const input = blessed.Textarea({
        parent: screen,
        mouse: true,
        left: 'center',
        bottom: 10,
        width: 30,
        height: 4,
        bg: 'black',
        inputOnFocus: true,
        value: "xkcd"
    });

    input.key(["enter"], function(data) {
        const room = input.value.trim();
        if (room) {
            screen.remove(input);
            screen.append(new tab(room, new Bot("K", room)));
            screen.render();
        } else {
            input.value = "";
            screen.render();
        }
    });


    input.focus();
    screen.render();

});


// Render the screen screen.
screen.render();
