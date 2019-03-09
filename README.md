# clitodo
Command line todo list manager.

## Install
```
npm i -g @riuandg5/clitodo
```
## Usage
```
todo
# Lists all todos.

todo init
# Initialize a todo list database.

todo add <todo> <done>
# Adds <todo> in the list with optional status 'done'.

todo del <index of todo>|<done>|<undone>|<all>
# Deletes todo from list.

todo done <index of todo>|<all>
# Marks todo as done.

todo undone <index of todo>|<all>
# Marks todo as undone.

todo help
# Shows list of commands and usage.
```