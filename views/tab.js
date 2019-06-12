const blessed = require('blessed');
const chalk = require('chalk');
const color = require('euphoria-color');

class tab extends blessed.Box {
    constructor(room, bot, parent) {
        super({
            keys: true,
            mouse: true,
        });

        this.title = `euphoria! &${room}`;

        const main = blessed.List({
            parent: this,
            top: 0,
            left: 0,
            width: '100%',
            keys: true,
            mouse: true,
            vi: true,
            scrollable: true,
            height: '100%',
            tags: true,
            label: `{bold}{blue-bg}&${room}{/blue-bg}{/bold}`,
            border: 'none',
            style: {
                // focus: {
                //     bg: 'blue'
                // },
                selected: {
                    bg: 'black'
                },
                fg: 'white',
                scrollbar: true,
            }
        });

        const userlist = blessed.List({
            parent: this,
            top: '0',
            right: '0',
            width: '20%',
            height: '100%',
            tags: true,
            label: `{bold}users{/bold}`,
            mouse: true,
            keys: true,
            scrollable: true,
            border: 'none',
            style: {
                scrollbar: true,
                fg: 'white',
                border: {
                    fg: '#f0f0f0'
                }
            }
        });

        this.main = main;
        this.userlist = userlist;
        // this.text = text;
        this.bot = bot;
        main.focus();
        // button.addListener('click', () => {
        //     form.submit();
        // });


        // text.addListener('submit', () => {
        //     form.submit();
        // });

        bot.on('ready', () => {
            main.setItems(print(map_comments(this.bot.log)));
            this.render();
            this.userlist.move(1);
            bot.connection.who();
            main.down(99);
        });

        bot.on('post', () => {
            main.setItems(print(map_comments(this.bot.log)));
            this.userlist.move(1);
            this.render();
        });

        bot.connection.on('who-reply', json => {
            const data = json.data;
            this.userlist.setItems(data.listing.map(user => {
					      return `${chalk.bgHsl(color(user.name), 100, 50)(user.name)}`;
            }));

            this.userlist.move(1);
            this.render();
        });


    }
}

function map_comments(list) {
    const map = [];
    const tree = [];

    function resolve(node){
        map[node.id] = node;
        let parent = node.parent;
        if(parent) {
            if (map[parent]) {
                if (map[parent].children) {
                    if (!map[node.parent].children.find(x => x.id === node.id))
                        map[parent].children.push(node);
                } else {
                    map[parent].children = [];
                    map[parent].children.push(node);
                }
            } else { // node does not exist
                map[parent] = {
                    children: [node]
                };
            }
        }
    }

    // mutates map
    list.forEach(x => resolve(x));

    Object.keys(map).forEach(key => {
        if(!map[key].parent && map[key].sender)
            tree.push(map[key]);
    });
    return tree;
}


function print(tree, depth = 0, is_last_child_of_root = false, result = []) {
    tree.forEach((x, i) => {
        if (depth === 1)
            is_last_child_of_root = i == tree.length-1;
        let padding = "";
        for (let i=0; i < depth; i++) {
            padding += "─";
        }
        let user = x.sender.name;
				user = chalk.bgHsl(color(user), 100, 50)(user);
        if (x.children) {
            result.push(`${depth>0?"├":"┌"}${padding}${user} ${x.content}`);
            result.concat(print(x.children, depth + 1, is_last_child_of_root, result));
        } else {
            let last = i == tree.length-1;
            result.push(`${depth>0?last?is_last_child_of_root?"└":"├":"├":"╶"}${padding}${user} ${x.content}`);
        }
    });
    return result;
}

module.exports = tab;
