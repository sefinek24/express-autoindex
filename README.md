# express-autoindex

<div>
	<a href="https://www.npmjs.com/package/express-autoindex">
		<img src="https://img.shields.io/npm/v/express-autoindex" alt="npm">
    </a>
	<img alt="GitHub" src="https://img.shields.io/github/license/c-bertran/express-autoindex">
	<img alt="npm" src="https://img.shields.io/npm/dm/express-autoindex">
</div>

`express-autoindex` produce a directory listing like Nginx, Apache or another, but just with express

It takes into consideration most of the mime-types correctly, and page generation is fully customizable.

The objectives are:
* Make a `HTML` page or `JSON` data easily usable, on the great majority of browsers
* Correctly take into consideration the majority of `MIME types`, and the generation of the most customizable pages possible
* Supports most common file encodings
* Native support for `Typescript`, `EcmaScript` and `CommonJS`
* The least amount of dependency possible (currently only `two`)
* The `lightest` possible

<p align="center">
	<img src="./md/img.png" width="540px" alt="Example image">
</p>

- [Install](#install)
- [API](#api)
    - [autoindex(path, options)](#autoindexpath-options)
    - [Options](#options)
- [Customization of the html page appearance](#customization-of-the-html-page-appearance)
    - [Variables](#variables)
    - [CSS](#css)
    - [HTML example](#html-example)
- [Customization of the date format](#customization-of-the-date-format)
    - [Optional character](#optional-character)
    - [Date format example](#date-format-example)
- [Customization of the JSON format](#customization-of-the-json-format)
    - [JSON example](#json-example)
- [Error handling](#error-handling)
    - [NodeJS error code list](#nodejs-error-code-list)
    - [Error code example](#error-code-example)
- [Minimalist example](#minimalist-example)
- [Production mode](#production-mode)
- [Contributors](#contributors)
- [To do list](#to-do-list)
- [License](#license)
- [Dependencies](#dependencies)

## Install

```sh
# npm
npm install express-autoindex

# yarn
yarn add express-autoindex
```

## API

```ts
import autoindex from 'express-autoindex';

// Root of server, ./public dir
app.use(autoindex('public'))

// Specific path `/files`, ./public dir
app.use('/files', autoindex('public'));

// Set options
app.use('/files', autoindex('public', { dirAtTop: false, displaySize: false }));
```

### autoindex(path, options)

Returns middlware that serves an index of the directory in the given `path`.

The `path` is based of the `req.url` value, so a `req.url` of `'/some/dir`
with a `path` of `'public'` will look at `'public/some/dir'`.

### Options

`express-autoindex` accepts options:

* #### alwaysThrowError
  type: `boolean`

  Throw error for all HTTP error codes (**4xx** & **5xx**).

  By default, errors will be generated only on **5xx** types. If you wish to generate an error regardless of the HTTP error code, pass `true` to the option.

  **Default** to `false`

* #### cache
  type: `number | false`

  Caches for a defined time the generated pages. Very useful to save server resources.

  Pass `false` to disable the cache, or the number of milliseconds representing the cache expiration time.

  **Default** to `300000` = 5 mins

* #### customJsonFormat
  type: `object`
  ```ts
  {
      isDir: string,
      name: string,
      path: string,
      time: string,
      size: string
  }
  ```

  By default, the json generated for a file or folder follows a precise structure. It is possible to rename or remove the **key** of this object.

  More detail [here](#customization-of-the-json-format)

  **Default** to `undefined`

* #### customTemplate
  type: `string`

  Pass the relative path of your custom template file. For example, if the file is located in the same folder of your startup server file, simply write `my-file.html` or `./my-file.html`.

  More detail [here](#customization-of-the-html-page-appearance)

  **Default** to `undefined`

* #### dateFormat
  type: `string`

  Custom date print format.

  More detail [here](#customization-of-the-date-format)

  **Default** to `undefined`

* #### dirAtTop
  type: `boolean`

  Display directories before files

  **Default** to `true`

* #### displayDate
  type: `boolean`

  Display the last modification date of the file or directory if available.

  **Default** to `true`

* #### displayDotfile
  type: `boolean`

  Display dotfiles (.env, .yarnrc, ...).

  **Default** to `false`

* #### displaySize
  type: `boolean`

  Display size of the file or directory if available.

  **Default** to `true`

* #### exclude
  type: `RegExp`

  Regular expression for files/dirs exclude, for example `/my-file.json|\*.cpp/`.

* #### json
  type: `boolean`

  Send data in json format instead of an html page. Might be useful if you want to use the data for another application.

  **Default** to `false`

* #### strict
  type: `boolean`

  Allow only `HEAD` and `GET` HTTP methods.

  **Default** to `true`

## Customization of the html page appearance

It is possible to customize the entire HTML page sent to the client. To do this, write an HTML page as usual. Then simply pass the path to your file to the `customTemplate` option.

### Variables

`express-autoindex` generates two variables:

1. **title** : the title of the generated page. Since this is an autoindex, the title represents the folder path
2. **content** : the contents of an html table representing the contents of the folder

To use variables in your template, simply call them between two curly brackets, like `{{title}}`.

### CSS

Elements inside a row of table all have their own *css* class linked to it, for easy access via a *css* selector. These classes are all placed on a <td>:

- **link** : url pointing to a file or folder
- **size** : folder or file size
- **time** : date of last folder or file modification

Don't forget that by default, every browser provides its own native *css*. If you want to standardize the look and feel, a little *css* will be necessary.

### HTML example

The html code below is the one generated by default. You can use it as inspiration to generate your own template.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    h1 {
      font-family: "Times New Roman", sans-serif;
    }
    
    table {
      font-family: "Courier New", sans-serif;
      font-size: 12px;
    }
    
    tr td:first-child {
      padding-right: 37px;
    }
    
    tr td:last-child:not(.back) {
      text-align: right;
      padding-left: 37px;
    }
  </style>
</head>
<body>
    <h1>{{title}}</h1>
    <hr>
    <table>
        {{content}}
    </table>
    <hr>
</body>
</html>
```

## Customization of the date format

It is possible to customize the entire date format of file or folder. To do this, pass a string containing the new format to the `dateFormat` option.

The date is a `string` containing the desired keys, by default `%d?-%mo-%y %h:%mi`.

It is formatted in **UTC** format, and has eight keys:
- *%wd* → week day
- *%d* → day
- *%mo* → month
- *%y* → year
- *%h* → hours
- *%mi* → minutes
- *%s* → seconds
- *%ms* → milliseconds

### Optional character

It's possible for one of these keys to return an empty `string` if nothing is available.

Now let's imagine that a separator is just after it. If it appears when the key is empty, it's not aesthetically pleasing.

You can therefore add the **?** character just after a key. This super character will ensure that the one following it only appears if the key is not empty.

For example, with the following format `%d?-%y`, if *%d* is empty, the string returned will be `2023` and not `-2023`.

### Date format example

```
US: %mo-%d?-$y %h:%mi

EU: %d?-%mo-%y %h:%mi

ISO: %y-%mo-%dT%h:%mi:%sZ

Custom format: <%d?-%y ~ %h>
```

## Customization of the JSON format

It is possible to customize the entire JSON format of file or folder. To do this, pass an object containing the new key names to the `customJsonFormat` option.

By default, the object generated for an element is:
- *isDir* → (**boolean**) is a folder
- *name* → (**string**) the name
- *path* → (**string**) the path (url)
- *time* → (**string**) the UTC date of the last modification
- *size* → (**number**) file size, `null` on a folder

The option object works according to three simple rules:
1. To change the name of the key, simply write an entry with the key you wish to change and the value representing its new name.
2. If a key is missing, it will not be added.
3. Any key that does not exist by default will not be added.


### JSON example

Here are a few examples to help you understand how it works:

<table>
<tr>
	<td>Options</td>
	<td>Generated JSON</td>
</tr>
<tr>
<td>

```json
{
	"isDir": "isADirectory",
	"name": "nameOfElement",
	"path": "url",
	"time": "date",
	"size": "weight"
}
```
</td>
<td>

```json
{
	"isADirectory": false,
	"nameOfElement": "history.md",
	"url": "/public/random_dir/history.md",
	"date": "07-Jul-2022 08:19",
	"weight": 348
}
```
</td>
</tr>
<tr>
<td>

```json
{
	"name": "nameOfElement",
	"path": "path"
}
```
</td>
<td>

```json
{
	"nameOfElement": "history.md",
	"path": "/public/random_dir/history.md"
}
```
</td>
</tr>
<tr>
<td>

```json
{
	"name": "name",
	"nonexistentKey": "defaultValue"
}
```
</td>
<td>

```json
{
	"name": "history.md"
}
```
</td>
</tr>
</table>

## Error handling

`express-autoindex` will do its best to handle Node.js errors correctly by converting them into a valid HTTP error. The default error type is **500**.

In no case `express-autoindex` handles custom error pages. The only thing done is to modify the statusCode of the `res` object and generate an error if necessary.

### NodeJS error code list

Below is a list of currently supported errors.

This is how to read the list: *The Node error code* → (**the related HTTP code**) "The error message".

- *EACCES* → (**500**) Permission denied
- *EADDRINUSE* → (**500**) Address already in use
- *EBADF* → (**500**) fd is not a valid open file descriptor
- *ECONNREFUSED* → (**500**) Connection refused
- *ECONNRESET* → (**500**) Connection reset by peer
- *EEXIST* → (**500**) File exists
- *EFAULT* → (**500**) Bad address
- *EINVAL* → (**500**) Invalid flag specified in flag
- *EISDIR* → (**500**) Is a directory
- *ELOOP* → (**500**) Too many symbolic links encountered while traversing the path
- *EMFILE* → (**500**) Too many open files in system
- *ENAMETOOLONG* → (**414**) URI Too Long
- *ENOENT* → (**404**) No such file or directory
- *ENOMEM* → (**500**) Out of memory
- *ENOTDIR* → (**404**) Not a directory
- *ENOTEMPTY* → (**500**) Directory not empty
- *ENOTFOUND* → (**500**) DNS lookup failed
- *EOVERFLOW* → (**500**)	pathname or fd refers to a file whose size, inode number, or number of blocks cannot be represented in, respectively, the types off_t, ino_t, or blkcnt_t
- *EPERM* → (**403**) Operation not permitted
- *EPIPE* → (**500**) Broken pipe
- *ETIMEDOUT* → (**408**) Request Timeout

### Error code example

To handle these errors, all you need to do after calling this middleware is to use a code of this type:

```ts
import { STATUS_CODES } from 'http';

// [...]

app.use((_req, res) => {
	// 4xx errors
	res.send(`<h1>${res.statusCode} ${STATUS_CODES[res.statusCode]}</h1>`);
});

app.use((err, _req, res, next) => {
	// 5xx errors
	res.send(`<h1>${res.statusCode} ${STATUS_CODES[res.statusCode]}</h1>`);
	if (err)
		console.error(err);
	next();
});

// [...]
```

## Minimalist example

```ts
import express from 'express';
import autoindex from 'express-autoindex';
import type { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', autoindex('public'));

app.listen(PORT, (): void => console.log(`Server is running at ${PORT}`));
```

## Production mode

When the variable `process.env.NODE_ENV` is set to **production**, error messages are much less detailed for security reasons.

## Contributors

Thanks to you and your help, express-autoindex is getting better every day. I would like to thank those people who gave their time 🧡

<div align="center">
	<a href="https://github.com/sefinek24">
		<img alt="sefinek24" width="70" style="border-radius: 50%" src="https://avatars.githubusercontent.com/u/92880265?v=4" />
	</a>
</div>

## To do list

1. Open the middleware for use outside express.js

## License

[MIT](LICENSE)

## Dependencies

[chardet](https://www.npmjs.com/package/chardet)

[mime](https://www.npmjs.com/package/mime)
