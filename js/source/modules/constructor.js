// =============================== Library Class
var Library = class__({
    /**
     * @description [The library class constructor.]
     * @param  {String} name [The name of the interaction.]
     * @param  {String} clone_interaction_id [The id of the interaction to clone options of.]
     * @return {Undefined}     [Nothing is returned.]
     */
    "constructor__": function(name, clone_interaction_id) {
        // if user does not invoke library with new keyword we use it for them by
        // returning a new instance of the library with the new keyword.
        if (!(this instanceof Library)) return new Library(name, clone_interaction_id);
        // cloning vars
        var parent, parent_options;
        // if cloning...get the interactions options
        if (clone_interaction_id) {
            // however, make sure the interaction exists
            parent = library.interaction(clone_interaction_id);
            if (parent) {
                // get the options
                parent_options = Object.assign({}, parent.options);
            }
        }
        // user provided options
        this.options = (parent_options || {});
        // object properties
        this.properties = {
            "iid": id(22), // library ID (internal)
            "enabled": false,
            "created": false,
            "locked": false,
            "removed": false,
            "fireCount": Infinity
        };
        // add the name if provided
        if (name) {
            this.options.name = name;
            this.properties.name = name;
        }
        // object defaults
        this.defaults = {
            "id": null, // user changeable ID
            "name": null,
            "events": [],
            "namespace": null,
            "anchors": [],
            "filters": [],
            "fireCount": Infinity,
            "capture": false,
            "passive": false,
            "debounce": null,
            "throttle": null,
            "handler": function() { /* noop */ }
        };
    },
    // class methods
    "methods__": {
        /**
         * @description [Adds id to options object.]
         * @param  {String} id [The id. Needs to be unique.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "id": function(id) {
            // cache the object
            var _ = this;
            // provided ID must be of specified type
            // if not, stop function execution
            if (id && dtype.isnot(id, "string")) return _;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // set the option
            _.options.id = id;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds the event types to listen to/interact with.]
         * @param  {String} arguments(n) [The name of event.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "on": function() {
            // cache the object
            var _ = this;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // add the option, if it doesn't exists
            if (!_.options.events) _.options.events = [];
            // normalize the mousewheel event although the wheel
            // event should be used:
            // {https://developer.mozilla.org/en-US/docs/Web/Events/wheel}
            var args = to_array(arguments),
                is_ff = /Firefox/.test(navigator.userAgent);
            args = args.map(function(event) {
                return ((is_ff && event === "mousewheel") ? "DOMMouseScroll" : event);
            });
            // add the best determined event constructor to each event
            //
            // supported events are listed below. check what event constructor your specific event needs
            // as non detected events (anything else that is not listed below) will result in the default
            // Event constructor. for other events refer to:
            // [https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events]
            var UIEvent = " abort error load resize scroll select unload ",
                MouseEvent = " click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show ",
                // custom library events list:
                // supports a primitive mutation implementation w/ possible future support of the bottom custom events:
                // dimensionchange widthchange heightchange contentflowchange contentoverflow contentunderflow
                LibraryEvent = " mutation ",
                func;
            for (var i = 0, l = args.length; i < l; i++) {
                // cache the current event
                var event = args[i].toLowerCase();
                // check if a function constructor name was provided
                // if one was provided, that one will be used. otherwise,
                // we do our best to determine what to use.
                if (event.charAt(0) !== ":") {
                    // determine what best to use...
                    if (-~UIEvent.indexOf(" " + event + " ")) func = "UIEvent";
                    else if (-~MouseEvent.indexOf(" " + event + " ")) func = "MouseEvent";
                    else if (-~LibraryEvent.indexOf(" " + event + " ")) func = "LibraryEvent";
                    else func = "Event"; // default
                } else func = "CustomEvent";
                // amend the argument
                args[i] = [event, func];
            }
            // add events to array
            // {http://stackoverflow.com/a/15444261}
            Array.prototype.push.apply(_.options.events, args);
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds event namespace to options object.]
         * @param  {String} namespace [The namespace.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "namespace": function(namespace) {
            // cache the object
            var _ = this;
            // provided namespace must be of specified type
            // if not, stop function execution
            if (namespace && dtype.isnot(namespace, "string")) return _;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // set the option
            _.options.namespace = namespace;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds the elements to which to bind the events to.]
         * @param  {String|HTMLElement} arguments(n) [The element nodes or
         *                                            #ID of elements to bind events to.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "anchors": function() {
            // cache the object
            var _ = this;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // add the option, if it doesn't exists
            if (!_.options.anchors) _.options.anchors = [];
            // add anchors to array
            // {http://stackoverflow.com/a/15444261}
            Array.prototype.push.apply(_.options.anchors, to_array(arguments));
            // return self to chain methods
            return _;
        },
        /**
         * @description [If using event delegation the filters act as middlware.
         *               In the sense that they are run before the handler only
         *               if the filter function returns true.]
         * @param  {String} arguments(n) [The name of the filters to use.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "filters": function() {
            // cache the object
            var _ = this;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // add the option, if it doesn't exists
            if (!_.options.filters) _.options.filters = [];
            // add filters to array
            // {http://stackoverflow.com/a/15444261}
            var filter_names = to_array(arguments),
                filters = [];
            for (var i = 0, l = filter_names.length; i < l; i++) {
                // define the current filter name
                var name = filter_names[i],
                    // delegation return type
                    return_type = "self",
                    // check for special delegation return type
                    // will default to "self" if none is found
                    position = index(name, "@");
                // check for filter return type
                if (indexed(position)) {
                    // get the return type
                    return_type = name.substring(position + 1, name.length);
                    // reset the name to exclude the return type
                    name = name.substring(0, position);
                }
                // get the filter function
                var filter = registry.filters[name];
                // if the function exists, add it to the filters for the
                // interaction
                if (filter) {
                    filters.push([filter, return_type, name]);
                }
            }
            // add filters to array
            // {http://stackoverflow.com/a/15444261}
            Array.prototype.push.apply(_.options.filters, filters);
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds the event handler fire count to the options object.]
         * @param  {Number} fire_count [The handler fire count.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "fireCount": function(fire_count) {
            // cache the object
            var _ = this;
            // provided fireCount must be of specified type
            // if not, stop function execution
            if (fire_count && dtype.isnot(fire_count, "number")) return _;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // set the option
            _.options.fireCount = fire_count;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds the capture flag to options object.
         *               Flag indicates whether the event captures or not.]
         * @param  {Boolean} flag [Bool indicating whether to capture.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "capture": function(flag) {
            // cache the object
            var _ = this;
            // provided flag must be of specified type
            // if not, stop function execution
            if (flag && dtype.isnot(flag, "boolean")) return _;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // set the option
            _.options.capture = flag;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds the passive flag to options object.
         *               Flag indicates whether the event should be passive or not.]
         * @param  {Boolean} flag [Bool indicating whether to capture.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "passive": function(flag) {
            // cache the object
            var _ = this;
            // provided flag must be of specified type
            // if not, stop function execution
            if (flag && dtype.isnot(flag, "boolean")) return _;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // set the option
            _.options.passive = flag;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds the debounce time to options object.
         *               Flag indicates whether the handler should be debounced.]
         * @param  {Number} time [Time to debounce handler by.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "debounce": function(time) {
            // cache the object
            var _ = this;
            // provided time must be of specified type
            // if not, stop function execution
            if (time && dtype.isnot(time, "number")) return _;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // set the option
            _.options.debounce = time;
            // set throttle flag to false
            _.options.throttle = false;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds the throttle time to options object.
         *               Flag indicates whether the handler should be throttled.]
         * @param  {Number} time [Time to throttle handler by.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "throttle": function(time) {
            // cache the object
            var _ = this;
            // provided time must be of specified type
            // if not, stop function execution
            if (time && dtype.isnot(time, "number")) return _;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // set the option
            _.options.throttle = time;
            // set throttle flag to false
            _.options.debounce = false;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Adds the event handler function to the options object.]
         * @param {String} name [The name of the handler.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "handler": function(name) {
            // cache the object
            var _ = this;
            // provided name must be of specified type
            // if not, stop function execution
            if (name && dtype.isnot(name, "string")) return _;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // get the handler
            var handler = registry.handlers[name];
            if (!handler) return;
            // set the option
            _.options.handler = handler;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Enables the Interaction.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "enable": function() {
            // cache the object
            var _ = this;
            // if event has not been created, create it
            if (!_.properties.created) {
                // get the Interaction object
                // normalize the options
                var options = normalized(_);
                // get normalized options
                var id = options.id,
                    anchors = options.anchors,
                    events = options.events,
                    namespace = options.namespace,
                    filters = options.filters,
                    fire_count = options.fireCount,
                    handler = options.handler,
                    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
                    options_ = {
                        "capture": options.capture,
                        "passive": options.passive
                    };
                // set the fireCount to the properties
                _.properties.fireCount = fire_count;
                // loop over anchors
                for (var i = 0, l = anchors.length; i < l; i++) {
                    // cache the current anchor
                    var anchor = anchors[i];
                    // loop over events
                    for (var j = 0, ll = events.length; j < ll; j++) {
                        // cache the current event
                        var event = events[j];
                        var event_name = event[0];
                        var event_type = event[1];
                        // attach the event
                        create_event(_, id, anchor, event_name, event_type, namespace, fire_count, handler, options_, filters);
                    }
                }
            }
            // finally, enable the object to allow the interaction to run
            _.properties.enabled = true;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Disables the interaction.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "disable": function() {
            // cache the object
            var _ = this;
            // set the option
            _.properties.enabled = false;
            // return self to chain methods
            return _;
        },
        /**
         * @description [Unbinds the event(s) from its anchors.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "remove": function() {
            // cache the object
            var _ = this,
                properties = _.properties;
            // if the object has not been created
            // there is no event to remove. simple unstore
            // the event object from the stored interactions.
            if (!_.properties.created) {
                // remove the event from the pool
                //
                // cache the interactions from registry
                var interactions = registry.interactions;
                //
                // get the objects position in the interactions array
                var position = index(interactions, _);
                //
                // if index exists remove event object from array
                if (indexed(position)) interactions.splice(position, 1);
                // set the removed property, in the case the user
                // still has a reference to it. however, the library
                // will no longer be tracking the event as it is no
                // longer in the registry
                properties.removed = true;
            } else { // else...remove the event listener
                // remove the event
                zeroed(_);
            }
            // return self to chain methods
            return _;
        },
        /**
         * @description [Resets the provided interaction options.]
         * @param {String} arguments [The N amount of properties to reset.]
         * @return {Undefined}     [Nothing is returned.]
         */
        "reset": function() {
            // cache the object
            var _ = this,
                defaults = _.defaults,
                options = _.options;
            // option cannot be set if object has been enabled
            if (_.properties.locked) return _;
            // get the properties in need of a reset
            var args = to_array(arguments);
            // loop over args and reset
            for (var i = 0, l = args.length; i < l; i++) {
                // cache the property
                var prop = args[i];
                // check that the property is indeed a library prop
                if (prop in defaults && defaults.hasOwnProperty(prop)) {
                    // reset the property
                    options[prop] = defaults[prop];
                }
            }
            // return self to chain methods
            return _;
        }
    },
    // class to extend
    "extend__": false
});