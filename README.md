
<!--#echo json="package.json" key="name" underline="=" -->
array-forest-domlike
====================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Access an array of arrays (of arrays…) as a tree structure inspired by browser
DOM.
<!--/#echo -->


Usage
-----
see [doc/demo/usage.js](doc/demo/usage.js)
:TODO:

```bash
$ array-forest-domlike foo
bar
```

```javascript
var array-forest-domlike = require('array-forest-domlike');
D.result  = array-forest-domlike(null);
D.expect('===',           null);
```


<!--#toc stop="scan" -->




License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
