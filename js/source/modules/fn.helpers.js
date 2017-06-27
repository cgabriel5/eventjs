// =============================== Helper Functions
/**
 * @description [Generates a simple ID containing letters and numbers.]
 * @param  {Number} length [The length the ID should be. Max length is 22 characters]
 * @return {String}        [The newly generated ID.]
 * @source {http://stackoverflow.com/a/38622545}
 */
function id(length) {
    return Math.random()
        .toString(36)
        .substr(2, length);
}
/**
 * @description [Returns index of given value in provided array.]
 * @param  {Array}    array [The array to check against.]
 * @param  {Integer}  value [The value to check.]
 * @return {Integer}        [Returns the index value. -1 if not in array.]
 */
function index(array, value) {
    return array.indexOf(value);
}
/**
 * @description [Checks if the given value is in provided array or string.]
 * @param  {Array|String}   iterable [The array or string to check against.]
 * @param  {Any}            value    [The value to check.]
 * @return {Boolean}                 [description]
 * @source [https://www.joezimjs.com/javascript/great-mystery-of-the-tilde/]
 * @source [http://stackoverflow.com/questions/12299665/what-does-a-tilde-do-
 * when-it-precedes-an-expression/12299717#12299717]
 */
function includes(iterable, value) {
    return -~index(iterable, value);
}
/**
 * @description [Checks if the provided index exists.]
 * @param  {Number} index [The index (number) to check.]
 * @return {Boolean}       [False if -1. Otherwise, true.]
 */
function indexed(index) {
    return -~index ? true : false;
}
/**
 * @description [Makes an Array from an array like object (ALO). ALO must have a length property
 *               for it to work.]
 * @param  {ALO} alo [The ALO.]
 * @return {Array}   [The created array.]
 */
function to_array(alo) {
    // vars
    var true_array = [];
    // loop through ALO and pushing items into true_array
    for (var i = 0, l = alo.length; i < l; i++) true_array.push(alo[i]);
    return true_array;
}
/**
 * @description [Returns the data type of the provided object.]
 * @param  {Any} object [The object to check.]
 * @return {String}    [The data type of the checked object.]
 */
var dtype = function(object) {
    // will always return something like "[object {type}]"
    return Object.prototype.toString.call(object)
        .replace(/(\[object |\])/g, "")
        .toLowerCase();
};
/**
 * @description [Check if the provided object is of the provided data types.]
 * @param  {Any} object [The object to check.]
 * @param  {String}  types  [The allowed data type the object may be.]
 * @return {Boolean}        [Boolean indicating whether the object is of the
 *                           allowed data types.]
 */
dtype.is = function(object, types) {
    // get the object type
    var type = this(object);
    // prepare the types
    types = "|" + types.toLowerCase()
        .trim() + "|";
    // check if the object's type is in the list
    return Boolean(-~types.indexOf("|" + type + "|"));
};
/**
 * @description [Check if the provided object is not of the provided data types.]
 * @param  {Any} object [The object to check.]
 * @param  {String}  types  [The prohibited data types.]
 * @return {Boolean}        [Boolean indicating whether the object is not of the
 *                           allowed data types.]
 */
dtype.isnot = function(object, types) {
    // return the inverse of the is method
    return !this.is(object, types);
};
/**
 * @description [Debounces provided function.]
 * @param  {Function} func            [The function to debounce.]
 * @param  {Number} time              [The time to debounce by.]
 * @param  {Object} scope             [The scope in which to run function with.]
 * @param  {Boolean} run_immediately  [Flag indicating whether the function
 *                                     should run immediately.]
 * @return {Function}                 [The new debounced function.]
 * @source debouncing function from John Hann
 * @source {http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/}
 * @source {https://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/}
 * @resource [Another debounce function] {https://davidwalsh.name/javascript-debounce-function}
 */
function debounce(func, time, scope, run_immediately) {
    var timeout;
    return function() {
        var context = (scope || this),
            args = arguments;

        function delayed() {
            if (!run_immediately) {
                func.apply(context, args);
            }
            timeout = null;
        }
        if (timeout) {
            clearTimeout(timeout);
        } else if (run_immediately) {
            func.apply(context, args);
        }
        timeout = setTimeout(delayed, time || 100);
    };
}
/**
 * @description [Throttles provided function.]
 * @param  {Function} func            [The function to throttle.]
 * @param  {Number} time              [The time to throttle by.]
 * @param  {Object} scope             [The scope in which to run function with.]
 * @return {Function}                 [The new throttled function.]
 * @source {https://remysharp.com/2010/07/21/throttling-function-calls}
 */
function throttle(func, time, scope) {
    time = (time || 250);
    var last, deferTimer;
    return function() {
        var context = (scope || this),
            now = +new Date(),
            args = arguments;
        if (last && now < last + time) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function() {
                last = now;
                func.apply(context, args);
            }, time);
        } else {
            last = now;
            func.apply(context, args);
        }
    };
}
/**
 * @description [A class wrapper. Creates a class based on provided object containing class constructor__ and methods__.
 *               If class needs to extend another, provide it under the extend__ property.]
 * @param  {Object} cobject [The class object containing three properties: constructor__, methods__, and extend__.
 *                           .constructor__ {Function}       [The class constructor]
 *                           .methods__     {Object}         [Object containing class methods.]
 *                           .extend__      {Boolean|Object} [Set to false if does not need to extend. Otherwise, provide the
 *                                                            class to extend.]
 *                           ]
 * @return {Function}         [Returns class constructor.]
 */
function class__(cobject) {
    // cache class data
    var constructor = cobject.constructor__,
        methods = cobject.methods__,
        parent = cobject.extend__;
    // extend if parent class provided
    if (parent) {
        constructor.prototype = Object.create(parent.prototype);
        constructor.prototype.constructor = constructor;
    }
    // cache prototype
    var prototype = constructor.prototype;
    // add class methods to prototype
    for (var method in methods) {
        if (methods.hasOwnProperty(method)) {
            prototype[method] = methods[method];
        }
    }
    return constructor;
}
