// =============================== Core Library Functions
/**
 * @description [Normalizes the Interaction object's options. In essence,
 *               the provided options are combined with the defaults.]
 * @param  {Object} _ [The Interaction object.]
 * @return {Object}   [The normalized options.]
 */
function normalized(_) {
    // cache object info
    var properties = _.properties,
        options = _.options;
    // combine the objects to normalize
    // {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign}
    var normalized = Object.assign({
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
    }, options);
    // check if id needs to be reset
    if (!normalized.id) normalized.id = properties.iid;
    // set the options
    _.options = normalized;
    // return the normalized the object
    return normalized;
}
// check functions
//
var checks = {
    /**
     * @description [Checks whether the passed in element and target.fromElement
     *               is of the main element and not the main element itself. This
     *               check is run to prevent the handler from firing on the ancestor
     *               elements. Basically, mimicking the "mouseenter" event. Where the
     *               handler is only fired on the main (parent) element.]
     * @param  {HTMLElement} result [The HTML element.]
     * @param  {Object} targets [An objects containing the events target elements.]
     * @return {HTMLElement|Null} [The HTML element if check passes. Otherwise, null.]
     */
    "mouseenter": function(result, targets) {
        return ((result && !result.contains(targets.fromElement)) ? result : null);
    },
    /**
     * @description [Checks whether the passed in element and target.toElement
     *               is of the main element and not the main element itself. This
     *               check is run to prevent the handler from firing on the ancestor
     *               elements. Basically, mimicking the "mouseleave" event. Where the
     *               handler is only fired on the main (parent) element.]
     * @param  {HTMLElement} result [The HTML element.]
     * @param  {Object} targets [An objects containing the events target elements.]
     * @return {HTMLElement|Null} [The HTML element if check passes. Otherwise, null.]
     */
    "mouseleave": function(result, targets) {
        return ((result && !result.contains(targets.toElement)) ? result : null);
    }
};
/**
 * @description [Function creates the internally used handler for the event, throttles/debounces if need be, and
 *               attaches the event to the anchor.]
 * @param  {Object} _            [The Interaction object to work with.]
 * @param  {String} id           [The ID of the Interaction object.]
 * @param  {HTMLElement} anchor  [The anchor element to unbind event from.]
 * @param  {String} event        [The event to remove.]
 * @param  {String} event_type   [The events constructor type.]
 * @param  {String} namespace    [The event namespace.]
 * @param  {Number} fire_count   [The amount of times the handler should fire.]
 * @param  {Function} handler    [The event handler.]
 * @param  {Object} options      [The event listener options.]
 * @param  {Array} filters       [The filters that should be run when using delegation.]
 * @return {Undefined}     [Nothing is returned.]
 */
function create_event(_, id, anchor, event, event_type, namespace, fire_count, handler, options, filters) {
    // the user's event handler gets wrapped with a function to apply
    // libray logic such as: filters (delegation) and fireCount.
    var fn = function(e) {
        // if the Interaction is disabled prevent from firing the handler
        if (!_.properties.enabled) return;
        // get all possible elements used by web browsers
        // currentTarget, fromElement, relatedTarget, srcElement, target, toElement
        // currentTarget, explicitOriginalTarget, originalTarget, relatedTarget, target
        //
        // event targets: {https://developer.mozilla.org/en-US/docs/Web/API/Event/Comparison_of_Event_Targets}
        var targets = {
            //
            // **Note: appropriate defaults are set for a better cross browser experience
            //
            // -- browser mutual event targets
            //
            // the element that trigger/dispatched the event
            "target": (e.target || null),
            // event info: {https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget}
            // always refers to the element that the event handler was attached to
            "currentTarget": (e.currentTarget || null),
            // event info: {https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget}
            // a read-only mouseevent property that refers to the secondary element involved in the event.
            "relatedTarget": (e.relatedTarget || null),
            //
            // -- all but ff
            //
            // event info: {https://developer.mozilla.org/en-US/docs/Web/API/Event/srcElement}
            // avoid using this event target and use e.target as this is just an alias for e.target
            "srcElement": (e.srcElement || e.target),
            // equivalent to ff's relatedTarget: {http://help.dottoro.com/ljjqfjbs.php}
            "fromElement": (e.fromElement || e.relatedTarget),
            // equivalent to ff's relatedTarget: {http://help.dottoro.com/ljltrsom.php}
            "toElement": (e.toElement || e.relatedTarget),
            //
            // -- ff specific
            //
            // do not use: {https://developer.mozilla.org/en-US/docs/Web/API/Event/explicitOriginalTarget} {http://stackoverflow.com/questions/179826/crossbrowser-equivalent-of-explicitoriginaltarget-event-parameter}
            "explicitOriginalTarget": (e.explicitOriginalTarget || null),
            // do not use: {https://developer.mozilla.org/en-US/docs/Web/API/Event/originalTarget}
            "originalTarget": (e.originalTarget || null)
        };
        // get the provided (synthetic targets) and combine with the above targets object
        // **Note**: synthetic elements are only provided on trigger events
        if (e.targets) targets = Object.assign(targets, e.targets);
        // check whether it's a mutation event. if so, reset the target & srcElement to the mutation targets
        if (e.detail && e.detail.__MUTATION_RECORD__) {
            var detail = e.detail.__MUTATION_RECORD__;
            targets = Object.assign(targets, {
                "target": detail.target,
                "srcElement": detail.target
            });
        }
        // define vars
        var delegate, filter_name;
        // run provided filters
        for (var i = 0, l = filters.length; i < l; i++) {
            // run the filter
            var result = filters[i][0].call(anchor, e, targets),
                // cache the filter return type
                return_type = filters[i][1],
                check;
            // cache the filter name
            filter_name = filters[i][2];
            // if there is a result (the filter provided us with a passable element)
            // fun the middleware return type functions
            if (result) {
                // apply the return type (this is the normal return type)
                // this return type will always return the result of the filter
                if (return_type === "self") {
                    delegate = result;
                    break;
                } else if (return_type === "mouseenter") {
                    // return type simulates the mouseenter event, therefore it checks
                    // the target elements are not the main element or an ancestor
                    check = (checks.mouseenter)(result, targets);
                    // if the check passes we have a main target and the delegate
                    // var can be set to the main target that the check returns
                    if (check) {
                        delegate = check;
                        break;
                    }
                } else if (return_type === "mouseleave") {
                    // return type simulates the mouseleave event, therefore it checks
                    // the target elements are not the main element or an ancestor
                    check = (checks.mouseleave)(result, targets);
                    // if the check passes we have a main target and the delegate
                    // var can be set to the main target that the check returns
                    if (check) {
                        delegate = check;
                        break;
                    }
                }
            }
            // if it's the last filter and no delegate element is
            // returned, this means the target element failed all
            // filters and the handler should not be run
            if (i === (l - 1) && !delegate) return;
        }
        // add the delegate to the targets object
        // if no delegate is detected it defaults to the currentTarget element
        // if (!targets.delegateTarget)
        targets.delegateTarget = (delegate || targets.currentTarget);
        // finally...invoke the user handler
        handler.call((delegate || anchor), e, targets, filter_name);
        // decrease the count
        _.properties.fireCount--;
        // if the fireCount zeroes, zeroe the Interaction (remove)
        if (_.properties.fireCount <= 0) return zeroed(_);
    };
    // check if the user wants the event debounced or throttled
    var options_ = _.options,
        debounce_ = options_.debounce,
        throttle_ = options_.throttle;
    // debounce handler if the user wants it
    if (debounce_) fn = debounce(fn, debounce_);
    // throttle handler if the user wants it
    if (throttle_) fn = throttle(fn, throttle_);
    // add the event
    anchor.addEventListener(event, fn, options);
    // MutationObserver::START
    // if event is a LibraryEvent (mutation) add setup a MutationObserver
    if (event_type === "LibraryEvent") {
        // [https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver]
        // create the mutation observer
        var observer = new MutationObserver(function(mutations) {
            // loop over the mutations
            for (var i = 0, l = mutations.length; i < l; i++) {
                var mutation = mutations[i];
                // [https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events]
                // [https://developer.mozilla.org/en-US/docs/Web/API/Event/Event]
                // [https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent]
                // [https://stackoverflow.com/a/19345563]
                // trigger the custom event
                anchor.dispatchEvent(new CustomEvent(event, {
                    // provide the mutation record object via the custom events
                    // detail data property.
                    detail: {
                        "__MUTATION_RECORD__": mutation
                    }
                }));
            }
        });
        // pass in the target node, as well as the observer options
        // [add way to allow the passage of an options method to let user pick
        // what mutations to listen to??]
        observer.observe(anchor, {
            "attributes": true,
            "childList": true,
            "characterData": true,
            "subtree": true,
            "attributeOldValue": true,
            "characterDataOldValue": true
        });
        // attach observer to internally made function handler to be able disconnect later
        fn.observer = observer;
    }
    // MutationObserver::END
    // add the new handler to the properties
    if (!_.properties.handlers) _.properties.handlers = [];
    _.properties.handlers.push(fn);
    // store the event
    registry.interactions.push(_);
    // set the option
    _.properties.created = true;
}
/**
 * @description [Function removes the provided event from provided anchor element.]
 * @param  {Object} _            [The Interaction object to work with.]
 * @param  {HTMLElement} anchor  [The anchor element to unbind event from.]
 * @param  {String} event        [The event to remove.]
 * @param  {Function} handler    [The event handler.]
 * @param  {Object} options      [The event listener options.]
 * @return {Undefined}     [Nothing is returned.]
 */
function remove_event(_, anchor, event, handler, options) {
    // remove the event
    anchor.removeEventListener(event, handler, options);
    // stop observing mutations if a mutation observer is present
    if (handler.observer) handler.observer.disconnect();
}
/**
 * @description [When an event has zeroed, when the fireCount is not set to
 *               Infinity, this function will remove all events from anchored
 *               elements and remove the Interaction object from the registry.]
 * @param  {Object} _ [The Interaction object to work with.]
 * @return {Undefined}     [Nothing is returned.]
 */
function zeroed(_) {
    // cache needed info
    var properties = _.properties,
        options = _.options,
        // options not needed
        // id = options.id,
        // filters = options.filters,
        // fire_count = options.fireCount,
        // handler = options.handler,
        // namespace = options.namespace,
        anchors = options.anchors,
        events = options.events,
        handlers = properties.handlers,
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        options_ = {
            "capture": options.capture,
            "passive": options.passive
        };
    // remove the event for all the provided anchors
    // loop over anchors
    for (var i = 0, l = anchors.length; i < l; i++) {
        // cache the current anchor
        var anchor = anchors[i];
        // loop over events
        for (var j = 0, ll = events.length; j < ll; j++) {
            // cache the current event
            var event = events[j][0];
            // attach the event
            remove_event(_, anchor, event, handlers[i], options_);
        }
    }
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
    _.properties.removed = true;
}