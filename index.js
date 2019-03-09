#!/usr/bin/env node

const fs = require("fs");

const tododb = "./.tododb";

function init() {
	if (fs.existsSync(tododb)) {
		console.log("Todo already initialised!");
	} else {
        setData({
			todos: []
		});
        console.log("Todo initialised!");
    }
}

function setData(data) {
	fs.writeFileSync(tododb, JSON.stringify(data));
}

function getData() {
	return JSON.parse(fs.readFileSync(tododb));
}

const isWindows = process.platform === 'win32';
const symbol = {
	check: isWindows ? "√ " : "✔ ",
	cross: isWindows ? "× " : "✖ "
}
function list() {
    if (fs.existsSync(tododb)) {
		let data = getData();
		if (data.todos.length > 0) {
			console.log("\tTODO");
			data.todos.forEach((todo, index) => {
				console.log(`\t${todo.status ? symbol.check : symbol.cross} ${index}. ${todo.title}`);
			});
		} else {
			console.log("Todo list is empty!");
		}
    } else {
        console.log("No .tododb file found! Please initialise Todo.");
    }
}

function add(todo, status) {
	if (fs.existsSync(tododb)) {
		if (todo) {
			if (!status) {
				status = false;
			} else {
				if (status === "done") {
					status = true;
				} else {
					console.log("Unexpected parameter: " + status);
					return;
				}
			}
			let data = getData();
			data.todos.push({
				title: todo,
				status: status
			});
			setData(data);
			list();
		} else {
			console.log("Missing argument!");
		}
    } else {
        console.log("No .tododb file found! Please initialise Todo.");
    }
}

function del(todo) {
	if (fs.existsSync(tododb)) {
		if (todo) {
			let data = getData();
			if (/^\d+$/.test(todo)) {
				if (data.todos[todo]) {
					data.todos.splice(todo, 1);
					setData(data);
				} else {
					console.log("No such todo found!");
				}
				list();
			} else if (todo === "done") {
				if (data.todos.length > 0) {
					data.todos = data.todos.filter(todo => {
						return !todo.status;
					})
					setData(data);
					console.log("All completed todos deleted.");
					list();
				} else {
					console.log("No todo to delete!");
				}
			} else if (todo === "undone") {
				if (data.todos.length > 0) {
					data.todos = data.todos.filter(todo => {
						return todo.status;
					})
					setData(data);
					console.log("All incomplete todos deleted.");
					list();
				} else {
					console.log("No todo to delete!");
				}
			} else if (todo === "all") {
				if (data.todos.length > 0) {
					data.todos = [];
					setData(data);
					console.log("All todos deleted.");
				} else {
					console.log("No todo to delete!");
				}
			} else {
				console.log("Wrong argument!")
			}
		} else {
			console.log("Missing argument!")
		}
	} else {
		console.log("No .tododb file found! Please initialise Todo.");
	}
}

function done(todo) {
	if (fs.existsSync(tododb)) {
		if (todo) {
			let data = getData();
			if (/^\d+$/.test(todo)) {
				if (data.todos[todo]) {
					if (data.todos[todo].status) {
						console.log("Todo: " + data.todos[todo].title + " is already done!")
					} else {
						data.todos[todo].status = true;
						setData(data);
						console.log("Todo: " + data.todos[todo].title + " is marked done.")
					}
				} else {
					console.log("No such todo found!");
				}
				list();
			} else if (todo === "all") {
				if (data.todos.length > 0) {
					data.todos.forEach(todo => {
						todo.status = !todo.status ? true : todo.status;
					});
					setData(data);
					console.log("All todos marked done.");
					list();
				} else {
					console.log("No todo to mark done!");
				}
			} else {
				console.log("Wrong argument!");
			}
		} else {
			console.log("Missing argument!");
		}
	} else {
		console.log("No .tododb file found! Please initialise Todo.");
	}
}

function undone(todo) {
	if (fs.existsSync(tododb)) {
		if (todo) {
			let data = getData();
			if (/^\d+$/.test(todo)) {
				if (data.todos[todo]) {
					if (!data.todos[todo].status) {
						console.log("Todo: " + data.todos[todo].title + " is already not done!")
					} else {
						data.todos[todo].status = false;
						setData(data);
						console.log("Todo: " + data.todos[todo].title + " is marked not done.")
					}
				} else {
					console.log("No such todo found!");
				}
				list();
			} else if (todo === "all") {
				if (data.todos.length > 0) {
					data.todos.forEach(todo => {
						todo.status = todo.status ? false : todo.status;
					});
					setData(data);
					console.log("All todos marked not done.");
					list();
				} else {
					console.log("No todo to mark not done!");
				}
			} else {
				console.log("Wrong argument!");
			}
		} else {
			console.log("Missing argument!");
		}
	} else {
		console.log("No .tododb file found! Please initialise Todo.");
	}
}

function help() {
	console.log("Usage: todo <command> <arguments>\n");
	console.log("No command\n\tLists all todos.\n");
	console.log("init\tInitialize a todo list database.\n");
	console.log("add\t<todo> <done>\n\tAdds <todo> in the list with optional status 'done'.\n");
	console.log("del\t<index of todo>|<done>|<undone>|<all>\n\tDeletes todo from list.\n");
	console.log("done\t<index of todo>|<all>\n\tMarks todo as done.\n");
	console.log("undone\t<index of todo>|<all>\n\tMarks todo as undone.\n");
	console.log("help\tShows list of commands and usage.\n");
}

const command = process.argv[2];
const argument1 = process.argv[3];
const argument2 = process.argv[4];

switch (command) {
	case "init":
		init();
		break;
	case "add":
		add(argument1, argument2);
		break;
	case "del":
		del(argument1);
		break;
	case "done":
		done(argument1);
		break;
	case "undone":
		undone(argument1);
		break;
	case "help":
		help();
		break;
	case undefined:
        list();
		break;
	default:
		console.log("Command not found: " + command);
		break;
}
