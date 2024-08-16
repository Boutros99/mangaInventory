const he = require('he');


function unescapeObject(object) {

    object.description=he.decode(object.description);

    // specific stuff
    if ('name' in object) {
        object.name=he.decode(object.name);
    };
    if ('title' in object) {
        object.title=he.decode(object.title);
    };
    if ('author' in object) {
        object.author=he.decode(object.author);
    };
    return object;
}

module.exports = {
    unescapeObject
}