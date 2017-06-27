// =============================== Global Library Functions/Methods/Vars
// registry to track of interactions, filters, and handlers
var registry = {
    "interactions": [],
    "filters": {},
    "handlers": {}
};
/**
 * @description [Returns all interactions.]
 * @return {Array} [The interactions in an array.]
 */
library.interactions = function() {
    return registry.interactions;
};
/**
 * @description [Returns all interactions where the provided element was used as an anchor.]
 * @return {Array} [An array of the interactions where the provided element was used as an anchor.]
 */
library.interactionsFor = function(anchor) {
    // get the interactions
    var interactions = library.interactions(),
        list = [];
    // loop over interactions...
    for (var i = 0, l = interactions.length; i < l; i++) {
        // cache the interaction...
        var interaction = interactions[i];
        // cache the anchors list
        var anchors = interaction.options.anchors;
        // add the interaction to the list...
        if (-~anchors.indexOf(anchor)) list.push(interaction);
    }
    // return the associated interactions
    return list;
};
/**
 * @description [Gets the interaction with the provided ID.]
 * @param {String} name   [The interaction ID.]
 * @return {Null|Object} [The interaction if found or null if otherwise.]
 */
library.interaction = function(id) {
    // return if no ID provided
    if (!id) return null;
    // get the interactions
    var interactions = library.interactions();
    // loop over interactions until the ID is matched...
    for (var i = 0, l = interactions.length; i < l; i++) {
        // cache the interaction...
        var interaction = interactions[i];
        if (interaction.options.id === id) {
            // return the interaction
            return interaction;
        }
    }
    return null; // no interaction found
};
/**
 * @description [Creates the synthetic event used by the trigger method.]
 * @param  {String} type         [The event name.]
 * @param  {String} func         [The event's event constructor function name.]
 * @param  {HTMLElement} anchor  [The anchor the event is bound to.]
 * @param  {Object} options      [The event options to use.]
 * @return {EventObject}         [The newly created synthetic event object.]
 */
function create_event_object(type, func, anchor, options) {
    // create the event object
    var event = new window[func](type, Object.assign({
        "bubbles": true,
        "cancelable": false,
        "scoped": false,
        "composed": false,
        // "detail": data // a custom "data" property is used instead (▼ below)
    }, (options.options || {})));
    // add custom properties to synthetic event object
    //
    // custom isSynthetic property denotes the event is a synthetic event
    event.isSynthetic = true;
    // custom data property contains the provided data, is provided
    event.data = (options.data || null);
    // create the targets object
    var targets = Object.assign({
        "target": null,
        "currentTarget": anchor,
        "relatedTarget": null,
        "srcElement": null,
        "fromElement": null,
        "toElement": null,
        "explicitOriginalTarget": null,
        "originalTarget": null
    }, (options.targets || {}));
    // add the targets to the event object
    // **Note: they are added as a single object as the actual
    // targets are read-only and cannot be modified. they are
    // looked up in the "create_event" event.
    event.targets = targets;
    // return the synthetic event object
    return event;
}
/**
 * @description [Trigger an interaction.]
 * @param  {String} id           [The ID of the interaction to trigger.]
 * @param  {Object} arguments[1] [The event options to use.]
 * @return {Undefined}           [Nothing is returned.]
 */
library.trigger = function(id) {
    // get the interaction
    var interaction = library.interaction(id);
    // if no interaction is found, return
    if (!interaction) return;
    // cache the interaction options, properties
    var opts = interaction.options,
        properties = interaction.properties;
    // get the anchors, events, handlers from the interaction
    var anchors = opts.anchors,
        events = opts.events,
        handler = properties.handlers[0];
    // cache the options argument
    var options = (arguments[1] || {});
    // run the handler
    for (var i = 0, l = anchors.length; i < l; i++) {
        for (var j = 0, ll = events.length; j < ll; j++) {
            // create the event object
            var event = create_event_object(events[j][0], events[j][1], anchors[i], options);
            // call the event handler
            handler.call(event, event);
        }
    }
};
/**
 * @description [Disables all interactions.]
 * @return {Undefined}     [Nothing is returned.]
 */
library.disableAll = function() {
    // get the interactions
    var interactions = library.interactions();
    // loop over interactions...
    for (var i = 0, l = interactions.length; i < l; i++) {
        // cache the interaction...
        var interaction = interactions[i];
        // disable the interaction
        interaction.disable();
    }
};
/**
 * @description [Enables all interactions.]
 * @return {Undefined}     [Nothing is returned.]
 */
library.enableAll = function() {
    // get the interactions
    var interactions = library.interactions();
    // loop over interactions...
    for (var i = 0, l = interactions.length; i < l; i++) {
        // cache the interaction...
        var interaction = interactions[i];
        // enable the interaction
        interaction.enable();
    }
};
/**
 * @description [Remove specific interaction.]
 * @param {String} id   [The interaction ID.]
 * @return {Boolean} [Boolean indicating whether the interaction was removed or not.]
 */
library.remove = function(id) {
    // return if no ID provided
    if (!id) return false;
    // get the interactions
    var interactions = library.interactions();
    // loop over interactions until the ID is matched...
    for (var i = 0, l = interactions.length; i < l; i++) {
        // cache the interaction...
        var interaction = interactions[i];
        if (interaction.options.id === id) {
            // remove interaction...
            interaction.remove();
            return true; // the interaction was removed!
        }
    }
    return false; // no interaction removed
};
/**
 * @description [Removes all interactions.]
 * @return {Undefined}     [Nothing is returned.]
 */
library.removeAll = function() {
    // get the interactions
    var interactions = library.interactions();
    // loop over interactions until the ID is matched...
    // **loop in reverse as the interaction remove method
    // mutates the interactions array and therefore changes
    // the arrays length.
    for (var i = (interactions.length - 1); i >= 0; i--) {
        // remove interaction...
        interactions[i].remove();
    }
};
/**
 * @description [Returns all handlers.]
 * @return {Array} [The handlers in an array.]
 */
library.handlers = function() {
    return registry.handlers;
};
/**
 * @description [Returns all filters.]
 * @return {Array} [The filters in an array.]
 */
library.filters = function() {
    return registry.filters;
};
/**
 * @description [Add a delegation filter.]
 * @param {String} name   [The name of the filter.]
 * @param {Function} filter [The filter function.]
 * @return {Undefined}     [Nothing is returned.]
 */
library.addFilter = function(name, filter) {
    registry.filters[name] = filter; // store the filter
};
/**
 * @description [Remove a delegation filter.]
 * @param {String} name   [The name of the filter.]
 * @return {Undefined}     [Nothing is returned.]
 */
library.removeFilter = function(name) {
    delete registry.filters[name]; // remove the handler
};
/**
 * @description [Add a handler.]
 * @param {String} name   [The name of the handler.]
 * @param {Function} handler [The handler function.]
 * @return {Undefined}     [Nothing is returned.]
 */
library.addHandler = function(name, handler) {
    registry.handlers[name] = handler; // store the handler
};
/**
 * @description [Remove a handler.]
 * @param {String} name   [The name of the handler.]
 * @return {Undefined}     [Nothing is returned.]
 */
library.removeHandler = function(name, handler) {
    delete registry.handlers[name]; // remove the handler
};
