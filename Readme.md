# get-module-file

This module is a utility for finding the path to a file within an installed
module.

## Example

Let's assume you have the following project structure:

```
-- my_module
  |
  |
  -- node_modules
  | |
  | |
  | -- style_mod
  |   |
  |   |
  |   -- style.css
  |
  |
  -- lib
    |
    |
    -- foo.js
```

For some reason your `foo.js` needs to read the contents of `style.css`. But
a module of assets usually cannot be `require`d (e.g. [concise.css][concise]).
On top of that, the `node_modules` directory may not be where you think if your
module is installed in another module; with npm3 the `style_mod` module could
be in the parent module's `node_modules`.

Solution: use `get-file-module` to find the file:

```javascript
const gfm = require('get-file-module');
gfm.future(__dirname, 'style_mod', '/style.css')
  .then(function(filePath) {
    // read the file and do whatever is you need to do
  });
```

[concise]: https://npmjs.com/package/concise.css

## API

### async(startDir, moduleName, filePath, callback)

+ `startDir`: the directory from which to start looking for `node_modules`
+ `moduleName`: the name of the module that contains the file you want
+ `filePath`: relative path to the file from the module directory
+ `callback`: a function with parameters `error` and `resolvedPath`.

### sync(startDir, moduleName, filePath)

+ `startDir`: the directory from which to start looking for `node_modules`
+ `moduleName`: the name of the module that contains the file you want
+ `filePath`: relative path to the file from the module directory
+ returns: `false` on error (i.e. can't find file) or the resolved file path

### future(startDir, moduleName, filePath)

+ `startDir`: the directory from which to start looking for `node_modules`
+ `moduleName`: the name of the module that contains the file you want
+ `filePath`: relative path to the file from the module directory
+ returns: a `Promise` that has the resolved file path on resolution and an
  `Error` on rejection (couldn't find the file)

## License

[MIT License](http://jsumners.mit-license.org/)
