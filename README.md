## quick.db2

`quick.db2` is a rewrite of `quick.db@7.1.3`, meant to provide an easy way to set up database, different from the newest version of quick.db.

support: [https://discord.gg/yvchR6V2PR](https://discord.gg/yvchR6V2PR "https://discord.gg/yvchR6V2PR")

## Example

*Below is a demo of **v7.1.5**, which is available on NPM by doing `npm i quick.db2`*

[**Code Sandbox Demo**](https://codesandbox.io/s/quickdb-demo-7ti8z?file=/src/index.js)

```js
// .init returns the table wrapper
const db = require('quick.db2').init("database.sqlite")()
// you can also do this
require('quick.db2').init('database.sqlite')
const db = require('quick.db2')();


// Setting an object in the database:
db.set('userInfo', { difficulty: 'Easy' })
// -> { difficulty: 'Easy' }

// Pushing an element to an array (that doesn't exist yet) in an object:
db.push('userInfo.items', 'Sword')
// -> { difficulty: 'Easy', items: ['Sword'] }

// Adding to a number (that doesn't exist yet) in an object:
db.add('userInfo.balance', 500)
// -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }

// Repeating previous examples:
db.push('userInfo.items', 'Watch')
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }
db.add('userInfo.balance', 500)
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }

// Fetching individual properties
db.get('userInfo.balance') // -> 1000
db.get('userInfo.items') // ['Sword', 'Watch']
```

## Installation

*If you're having troubles installing, please follow [this troubleshooting guide](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).*

**Linux & Windows**

- `npm i quick.db`

***Note:** Windows users may need to do additional steps [listed here](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).*

**Mac**

1. **Install:** XCode
2. **Run:** `npm i -g node-gyp` in terminal
3. **Run:** `node-gyp --python /path/to/python2.7` (skip this step if you didn't install python 3.x)
4. **Run:** `npm i quick.db`
