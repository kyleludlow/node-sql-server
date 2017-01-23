#Node SQL Server

This is a Node server with an SQL database. A todo list is used as an example, but the model can easily be changed to emulate your app's needs.

Sequelize is being used to generate SQL queries and manipulate table data. I've chosen to use Sequelize because it is well-documented, easy to use, has few bugs, and is actively used by many developers as seen on npm. For scalability, raw SQL queries can later be used instead, but for small to mid-sized apps, Sequelize works smoothly. The database has been configured so that during development, an sqlite db is used, and when deployed to production, PostgreSQL is used.

This app is formatted using [StandardJS](https://github.com/feross/standard) style guidelines.

## Dependencies
* express
* body-parser
* underscore
* pg
* sequelize
* sqlite3

You can learn more about me and my code at [kyleludlow.io](http://www.kyleludlow.io). I'm available for hire!
