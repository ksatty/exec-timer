# Execution Timer

Measure execution time of functions and promises

`npm install exec-timer`

```
const timer = require('exec-timer');
```

```
function f (param1, param2) {
    return `f -> ${param1}+${param2}`;
}

let result = timer.measure('function f()', (end) => {
    end();
    return f('a', 'b');
});

console.log(timer.get('function f()'));
```

```
function cb (param1, param2, callback) {
    setTimeout(() => {
        callback(`cb -> ${param1}+${param2}`);
    }, 500);
}

timer.measure('function cb()', (end) => {
    cb('c', 'd', data => {
        end();

        console.log(timer.get('function cb()'));
    });
});
```

```
timer.measure('promise', new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('promise -> resolved');
    }, 200);
})).then(data => {
    console.log(timer.get('promise'));
}).catch(error => {
    console.log(timer.get('promise'));
});
```

```
timer.start('measure');
// Some code
timer.end('measure');
```

Get all measures
```
timer.get(); // Map
timer.get().toObject() // Object
```