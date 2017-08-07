# events (interactionjs)

Small library for event handling.

##### Table of Contents

- [Project Setup](#project-setup)
- [What It Does](#what-it-does)
- [Add To Project](#add-to-project)
- [API](#api)
    - [Global](#global-api)
    - [Instance](#instance-api)
- [Usage](#usage)
    - [Overview](#example-overview)
    - [Click Event](#example-click-event)
    - [Resize Event](#example-resize-event)
    - [MouseWheel Event](#example-mousewheel-event)
    - [Cloning Event](#example-cloning-event)
    - [Custom Event](#example-custom-event)
    - [Event Delegation](#example-event-delegation)
        - [Mouseenter Event](#example-mouseenter-event)
        - [Mouseleave Event](#example-mouseleave-event)
        - [Mouseover Event](#example-mouseover-event)
        - [Click Delegation Example 1](#example-click-delegation-1)
        - [Click Delegation Example 2](#example-click-delegation-2)
    - [Triggering](#example-triggering)
        - [No Delegation](#triggering-no-delegation)
        - [Delegation](#triggering-delegation)
- [Contributing](#contributing)
- [License](#license)

<a name="project-setup"></a>
### Project Setup

Project uses [this](https://github.com/cgabriel5/snippets/tree/master/boilerplate/application) boilerplate. Its [README.md](https://github.com/cgabriel5/snippets/blob/master/boilerplate/application/README.md#-read-before-use) contains instructions for `Yarn` and `Gulp`.

<a name="what-it-does"></a>
### What It Does

* Create, remove, manage (list, disable, enable, trigger) events

<a name="add-to-project"></a>
### Add To Project

**Note**: The library, both minimized and unminimized, is located in `lib/`.

```html
<script src="path/to/lib.js"></script>
<script>
document.onreadystatechange = function() {
    "use strict";
    // once all resources have loaded
    if (document.readyState == "complete") {
        // get the library
        var Interaction = window.app.libs.Interaction;
        // logic...
    }
});
</script>
```

<a name="api"></a>
## API

<a name="global-api"></a>
### API &mdash; Global

<a name="global-methods-toc"></a>

- [➜ global.interactions()](#global-methods-interactions)
- [➜ global.interactionsFor()](#global-methods-interactionsfor)
- [➜ global.interaction()](#global-methods-interaction)
- [➜ global.trigger()](#global-methods-trigger)
- [➜ global.disableAll()](#global-methods-disableall)
- [➜ global.enableAll()](#global-methods-enableall)
- [➜ global.remove()](#global-methods-remove)
- [➜ global.removeAll()](#global-methods-removeall)
- [➜ global.handlers()](#global-methods-handlers)
- [➜ global.filters()](#global-methods-filters)
- [➜ global.addFilter()](#global-methods-addfilter)
- [➜ global.removeFilter()](#global-methods-removefilter)
- [➜ global.addHandler()](#global-methods-addhandler)
- [➜ global.removeHandler()](#global-methods-removehandler)

<a name="global-methods-long"></a>
### Global Methods

<a name="global-methods-interactions"></a>
➜ **global.interactions** &mdash; Returns an array of all the created interactions.

- **No Parameters**
- **Returns** Nothing.

```js
Interaction.interactions();
```

<a name="global-methods-interactionsfor"></a>
➜ **global.interactionsFor(`element`)** &mdash; Returns all interactions where the provided element was used as an anchor.

- `element` (`HTMLElement`, _Required_)
- **Returns** array containing all the interactions where the element is the anchor.

```js
Interaction.interactionsFor(document);
Interaction.interactionsFor(window);
Interaction.interactionsFor(document.getElementById("container"));
```

<a name="global-methods-interaction"></a>
➜ **global.interaction(`id`)** &mdash; Returns the interaction matching the provided id.

- `id` (`String`, _Required_)
- **Returns** the interaction matching the provided id.

```js
Interaction.interaction("interaction_id");
```

<a name="global-methods-trigger"></a>
➜ **global.trigger(`id`, `options`)** &mdash; Triggers an interaction.

- `id` (`String`, _Required_) The interaction id.
- `options` (`Object`, _Optional_)
    - `targets` (`Object`, _Optional_) The elements to use as targets, primarily intended for delegation use.
        - **Note**: When event delegation is used provide the correct [target elements](#targets-object) so the event's handler works as expected (as if it was naturally invoked). Providing the necessary target elements will allow the [interaction's filter functions](#delegation-targets) to pass and in turn invoke the handler.
        - `target` (`HTMLElement`, _Optional_)
        - `currentTarget` (`HTMLElement`, _Optional_)
        - `relatedTarget` (`HTMLElement`, _Optional_)
        - `srcElement` (`HTMLElement`, _Optional_)
        - `fromElement` (`HTMLElement`, _Optional_)
        - `toElement` (`HTMLElement`, _Optional_)
        - `explicitOriginalTarget` (`HTMLElement`, _Optional_)
        - `originalTarget` (`HTMLElement`, _Optional_)
    - `options` (`Object`, _Optional_) Event options.
        - `bubbles` (`Boolean`, _Optional_, _Default_: `true`)
        - `cancelable` (`Boolean`, _Optional_, _Default_: `false`)
        - `scoped` (`Boolean`, _Optional_, _Default_: `false`)
    - `data` (`Any`, _Optional_) Anything may be passed in as data.
- **Returns** Nothing.

```js
Interaction.trigger("interaction_id", options);
```

<a name="global-methods-disableall"></a>
➜ **global.disableAll** &mdash; Disables all interactions.

- **No Parameters**
- **Returns** Nothing.

```js
Interaction.disableAll();
```

<a name="global-methods-enableall"></a>
➜ **global.enableAll** &mdash; Enables all interactions.

- **No Parameters**
- **Returns** Nothing.

```js
Interaction.enableAll();
```

<a name="global-methods-remove"></a>
➜ **global.remove(`id`)** &mdash; Removes interaction matching the provided id.

- `id` (`String`, _Required_) The interaction id.
- **Returns** Nothing.

```js
Interaction.remove("interaction_id");
```

<a name="global-methods-removeall"></a>
➜ **global.removeAll** &mdash; Removes all interactions.

- **No Parameters**
- **Returns** Nothing.

```js
Interaction.removeAll();
```

<a name="global-methods-handlers"></a>
➜ **global.handlers** &mdash; Returns an object containing all the handlers.

- **No Parameters**
- **Returns** Nothing.

```js
Interaction.handlers();
```

<a name="global-methods-filters"></a>
➜ **global.filters** &mdash; Returns an object containing all the filters.

- **No Parameters**
- **Returns** Nothing.

```js
Interaction.filters();
```

<a name="global-methods-addfilter"></a>
➜ **global.addFilter(`filterName`, `handler`)** &mdash; Adds a filter to the internal filters registry.

- `filterName` (`String`, _Required_) The name of the filter.
- `handler` (`Function`, _Required_)
    - `e` (`EventObject`) The browser event object.
    - `targets` (`Object`) Library provided [normalized target elements](#targets-object) object.
- **Returns** Nothing.

```js
Interaction.addFilter("filer_name", function(e, targets) { /*logic*/ });
```

<a name="global-methods-removefilter"></a>
➜ **global.removeFilter(`filterName`)** &mdash; Removes a filter from the internal filters registry.

- `filterName` (`String`, _Required_)
- **Returns** Nothing.

```js
Interaction.removeFilter("filer_name");
```

<a name="global-methods-addhandler"></a>
➜ **global.addHandler(`filterName`, `handler`)** &mdash; Adds a handler to the internal handlers registry.

- `filterName` (`String`, _Required_) The name of the filter.
- `handler` (`Function`, _Required_)
    - `e` (`EventObject`) The browser event object.
    - `targets` (`Object`) Library provided [normalized target elements](#targets-object) object.
    - `filter_name` (`String`) The filter used, if any.
- **Returns** Nothing.

```js
Interaction.addHandler("filer_name", function(e, targets, filter_name) { /*logic*/ });
```

<a name="global-methods-removehandler"></a>
➜ **global.removeHandler(`filterName`)** &mdash; Removes a handler from the internal handlers registry.

- `filterName` (`String`, _Required_)
- **Returns** Nothing.

```js
Interaction.removeHandler("filer_name");
```

<a name="instance-api"></a>
### API &mdash; Instance

<a name="instance-methods-toc"></a>

- [Instance](#instance-creation)
    - [Delegation (targets)](#delegation-targets)
    - [Targets Object](#targets-object)
    - [Data Object](#data-object)
    - [➜ instance.id()](#instance-methods-id)
    - [➜ instance.on()](#instance-methods-on)
    - [➜ instance.namespace()](#instance-methods-namespace)
    - [➜ instance.anchors()](#instance-methods-anchors)
    - [➜ instance.filters()](#instance-methods-filters)
    - [➜ instance.fireCount()](#instance-methods-firecount)
    - [➜ instance.capture()](#instance-methods-capture)
    - [➜ instance.passive()](#instance-methods-passive)
    - [➜ instance.debounce()](#instance-methods-debounce)
    - [➜ instance.throttle()](#instance-methods-throttle)
    - [➜ instance.handler()](#instance-methods-handler)
    - [➜ instance.enable()](#instance-methods-enable)
    - [➜ instance.disable()](#instance-methods-disable)
    - [➜ instance.remove()](#instance-methods-remove)
    - [➜ instance.reset()](#instance-methods-reset)

<a name="instance-creation"></a>
### Instance Creation

- `interactionName` (`String`, _Optional_) The name of the interaction.
- `interactionCloneID` (`String`, _Optional_) The id of the interaction to clone.
- **Returns** instance.

**Note**: Using the `new` keyword is not necessary. The library will make sure to use it for when when you don't.

```js
// this...
var interaction = new Interaction();
// is the same as this
var interaction = Interaction();
```

**Note**: Interaction name be provided upon instance creation. Although not necessary it serves as a human identifier for what the interaction is for.

```js
var interaction = new Interaction("Main Body Click.");
```

**Note**: Providing the second parameter (`interactionCloneID`), will clone the options of that interaction to the new interaction. The following example will create a new interaction with a name of `Main Body Click` and will clone the options from the interaction with the id of `custom`.

**Note**: When cloning sometimes options need to be reset to their default value. The `instance.reset` method is used for this. For example, the following example code resets then updates the id to `test456`.

```js
var interaction = new Interaction("Main Body Click.", "custom")
    .reset("id") // reset the id
    .id("test456") // add new id
    .enable();
```

<a name="delegation-targets"></a>
### Delegation (targets)  

The library provides a normalized `targets` object with the event's target elements. This object may be accessed as the second parameter like so...

```js
Interaction.addFilter("filer_name", function(e, targets) { /*logic*/ });
Interaction.addHandler("filer_name", function(e, targets, filter_name) { /*logic*/ });
```

Additionally, when event delegation is used the name of the filter function that passed, if any, is returned. This is useful when multiple filter functions are used for a single interaction. The passing filter will always be passed as the third parameter.

<a name="targets-object"></a>
### Targets Object

**Note**: When triggering an event the `targets` object may either be accessed as the second parameter or from the browser provided `EventObject` (i.e. `event.targets`).

The `targets` object contains the following targets (elements):

- [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target) The element that trigger/dispatched the event.
- [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget) Always refers to the element that the event handler was attached to.
- [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget) A mouseevent property that refers to the secondary element involved in the event.
- [`srcElement`](https://developer.mozilla.org/en-US/docs/Web/API/Event/srcElement) Avoid using this event target and use `e.target` as this is just an alias for `e.target`.
- [`fromElement`](http://help.dottoro.com/ljjqfjbs.php) Equivalent to FireFox's relatedTarget.
- [`toElement`](http://help.dottoro.com/ljltrsom.php) Equivalent to FireFox's relatedTarget.
- [`explicitOriginalTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/explicitOriginalTarget) FireFox specific and should not be used as is it non-standard.
- [`originalTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/originalTarget) FireFox specific and should not be used as is it non-standard.

<a name="data-object"></a>
### Data Object

When triggering an event a `data` object may be passed containing any type of data. The data object is then attached to the browser provided `EventObject`. Accessing it is as simple as `event.data` like so...

```js
// interaction handler
Interaction.addHandler("some_handler_name", function(e, targets, filter_name) {
    var data = e.data; // [1, 2, 3]
    // do something with data...
});

// trigger interaction
Interaction.trigger("some_handler_name", {
    "data": [1, 2, 3]
});
```

**Note**: When event delegation is used provide the correct [target elements](#targets-object) so the event's handler works as expected (as if it was naturally invoked). Providing the necessary target elements will allow the [interaction's filter functions](#delegation-targets) to pass and in turn invoke the handler.

<a name="instance-methods-long"></a>
### Instance Methods

<a name="instance-methods-id"></a>
➜ **instance.id(`id`)** &mdash; Set the interaction id.

- `id` (`String`, _Required_)
    - **Note**: The provided id must be unique.
    - id is used to access the interaction to remove, enable/disable, trigger, etc.
- **Returns** instance.

```js
interaction.id("some_unique_id");
```

<a name="instance-methods-on"></a>
➜ **instance.on(`eventName`, `eventNameN...`)** &mdash; The events to listen for.

- `eventName` (`String`, _Required_)
    - **Note**: `n` amount of events may be passed.
- **Returns** instance.

```js
interaction.on("click", "wheel");
```

<a name="instance-methods-namespace"></a>
➜ **instance.namespace(`namespace`)** &mdash; The namespace the events should be under.

- `namespace` (`String`, _Required_)
    - **Note**: Namespace may be nested. Just use dots to separate each namespace.
- **Returns** instance.

```js
interaction.namespace("namespace1.namespace2.namespaceN");
```

<a name="instance-methods-anchors"></a>
➜ **instance.anchors(`element`, `elementN...`)** &mdash; The elements to attach the events to.

- `element` (`HTMLElement`, _Required_)
    - **Note**: `n` amount of elements may be passed.
- **Returns** instance.

```js
var $cont = document.getElementById("cont");
interaction.anchors(document, window, $cont);
```

<a name="instance-methods-filters"></a>
➜ **instance.filters(`filter`, `filterN...`)** &mdash; If using event delegation, filters may be used to filter out the wanted element(s).

- `filter` (`String`, _Required_)
    - **Note**: `n` amount of filters may be passed.
- **Returns** instance.

```js
interaction.filters("filter1", "filter2");
```

<a name="instance-methods-firecount"></a>
➜ **instance.fireCount(`count`)** &mdash; The amount of times the handler should fire.
If not provided the count is set to `Infinity`.

- `count` (`Number`, _Required_)
    - **Note**: Once the count reaches zero the event is automatically removed.
- **Returns** instance.

```js
interaction.fireCount(1); // fire once
```

<a name="instance-methods-capture"></a>
➜ **instance.capture(`flag`)** &mdash; Should the event capture?

- `flag` (`Boolean`, _Required_)
- **Returns** instance.

```js
interaction.capture(true);
```

<a name="instance-methods-capture"></a>
➜ **instance.capture(`flag`)** &mdash; Should the event be passive?

- `flag` (`Boolean`, _Required_)
- **Returns** instance.

```js
interaction.passive(true);
```

<a name="instance-methods-debounce"></a>
➜ **instance.debounce(`time`)** &mdash; Should the event be debounced?

- `time` (`Number`, _Required_)
- **Returns** instance.

**Note**: The event may be throttled or debounced but not both.

```js
interaction.debounce(250);
```

<a name="instance-methods-throttle"></a>
➜ **instance.throttle(`time`)** &mdash; Should the event be throttled?

- `time` (`Number`, _Required_)
- **Returns** instance.

**Note**: The event may be throttled or debounced but not both.

```js
interaction.throttle(250);
```

<a name="instance-methods-handler"></a>
➜ **instance.handler(`handlerName`)** &mdash; The event handler.

- `handlerName` (`String`, _Required_)
- **Returns** instance.

```js
interaction.handler("handler1");
```

<a name="instance-methods-enable"></a>
➜ **instance.enable** &mdash; Enables/re-enables the event.

- **No Parameters**
- **Returns** Nothing.

```js
interaction.enable();
```

<a name="instance-methods-disable"></a>
➜ **instance.disable** &mdash; Disables (mutes) the event.

- **No Parameters**
- **Returns** Nothing.

```js
interaction.disable();
```

<a name="instance-methods-reset"></a>
➜ **instance.reset(`propName`, `propNameN...`)** &mdash; Resets properties to its default.

- `propName` (`String`, _Required_)
    - **Note**: `n` amount of property names may be passed.
- **Returns** instance.

**Note**: This method is really meant to be used when cloning an interaction as it resets a property that is needed to change.

```js
var interaction = new Interaction("Main Body Click.", "custom")
    .reset("id") // reset the id
    .id("test456") // add new id
    .enable();
```

<a name="usage"></a>
### Usage

For a better understanding check out `index.html` and `js/source/test.js`. `js/source/test.js` contains examples showing how the library is used.

**Note:** [FunnelJS](https://github.com/cgabriel5/funneljs) is used in the filters for the `js/source/test.js` examples as well as in the examples below. [FunnelJS](https://github.com/cgabriel5/funneljs) is a simple, standalone, lightweight JavaScript selector engine. Its use in these examples is to filter out the target element(s) provided to it. Although used, it is not necessary as the filtering may be done using VanillaJS. The library is just very useful for filtering elements.

**Note**: The following are just examples and is not an exhaustive list of the supported events. The library is just a wrapper for the `addEventListener`. Therefore, all native JavaScript events may be used.

<a name="example-overview"></a>
**Overview** &mdash; Usage overview.

- Using interactions work in one of two patterns:
    - No event delegation:
        - **Step 1** &mdash; Add handler.
        - **Step 2** &mdash; Create interaction.
    - Event delegation:
        - **Step 1** &mdash; Add delegation filter.
        - **Step 2** &mdash; Add handler.
        - **Step 3** &mdash; Create interaction.

<a name="example-click-event"></a>
**Click Event** &mdash; A simple click event example.

```js
Interaction.addHandler("container_click", function(e, targets, filter_name) {
    console.log("Container Clicked!", filter_name);
    // logic...
});
```
```js
var event = new Interaction("Container click!") 
    .on("click")
    .anchors(Funnel("#cont").getElement()) 
    .handler("container_click")
    .fireCount(4)
    .enable();
```

<a name="example-resize-event"></a>
**Resize Event** &mdash; Monitor the window for any resizing.

```js
Interaction.addHandler("window_resize", function(e, targets, filter_name) {
    console.log("Resized!", filter_name);
    // logic...
});
```

```js
var event = new Interaction("Window Resize!")
    .id("intWindowResize")
    .on("resize")
    .anchors(window)
    .handler("window_resize")
    // .throttle(300) // <-- *debounce or throttle heavy interactions*
    // .debounce(300) // <-- *debounce or throttle heavy interactions*
    .fireCount(20)
    .enable();
```

- **Note**: Heavy events like the resize event should be throttled or debounced when used as they may hamper and bog down the user's browser.

<a name="example-mousewheel-event"></a>
**MouseWheel Event** &mdash; Simple scroll event example.

```js
Interaction.addHandler("body_mousewheel", function(e, targets, filter_name) {
    console.log("Body MouseWheel!", filter_name);
    // logic...
});
```

```js
var event = new Interaction("Body MouseWheel")
    .id("intBodyMouseWheel")
    .on("mousewheel")
    .anchors(document)
    .handler("body_mousewheel")
    .fireCount(10)
    .enable();
```

- **Note**: The `mousewheel` may be used for all browsers. Internally the correct `mousewheel` or `DOMMouseScroll` event will be applied.

<a name="example-cloning-event"></a>
**Cloning Event** &mdash; Interactions may also be cloned.

- **Note**: A cloned interaction will use the source interaction's handler unless reset and updated to a new handler.

```js
var event = new Interaction("My Cloned Interaction", "intWindowResize")
    // change any options here...
    .reset("id")
    .id("intWindowResizeClone")
    .enable();
```

<a name="example-custom-event"></a>
**Custom Event** &mdash; Custom events may also be created.

```js
Interaction.addHandler("custom_event", function(e, targets, filter_name) {
    console.log("Custom Event!", filter_name);
    // logic...
});
```

```js
// Custom Event Example
var event = new Interaction("Custom Event")
    .id("intCustomEvent")
    .on(":build")
    .anchors(document)
    .handler("custom_event")
    .enable();
```

- **Note**: Custom events should be prefixed with a colon.

<a name="example-event-delegation"></a>
**Event Delegation** &mdash; Some examples using the library for event delegation.

- **Note**: Event delegation requires the use of filter functions. Filter functions are middleware functions because they only serve to filter the wanted target element. Only when a target element passes a filter will the interaction's handler be invoked. The passing target may then be accessed from within the handler via the [targets object (second parameter)](#delegation-targets).

<a name="example-mouseenter-event"></a>
**Mouseenter Event** &mdash; Library provided mouseenter event.

```js
// Using FunnelJS, filter and return an element that has the class "cont".
Interaction.addFilter("container_mouseover", function(e, targets) {
    // filter logic
    var parents = Funnel(targets.target)
        .parents()
        .getStack();
    return Funnel(targets.target)
        .concat(parents)
        .classes("cont")
        .getElement();
});
```

```js
Interaction.addHandler("container_mouseover", function(e, targets, filter_name) {
    console.log("Mouseover!", filter_name);
    // logic...
});
```

```js
var event = new Interaction("Container Mouseenter")
    .on("mouseover")
    .anchors(document)
    .filters("container_mouseover@mouseenter")
    .handler("container_mouseover")
    .enable();
```

- **Note**: When _any_ filter passes the handler gets invoked.
- **Note**: The `@mouseenter` tells the library to treat the mouseover event as a mouseenter event.

<a name="example-mouseleave-event"></a>
**Mouseleave Event** &mdash; Library provided mouseleave event.

```js
// Using FunnelJS, filter and return an element that has the class "cont".
Interaction.addFilter("container_mouseleave", function(e, targets) {
    // filter logic
    var parents = Funnel(targets.target)
        .parents()
        .getStack();
    return Funnel(targets.target)
        .concat(parents)
        .classes("cont")
        .getElement();
});
```

```js
Interaction.addHandler("container_mouseleave", function(e, targets, filter_name) {
    console.log("Mouseleave!", filter_name);
    // logic...
});
```

```js
var event = new Interaction("Container Mouseleave")
    .on("mouseout")
    .anchors(document)
    .filters("container_mouseleave@mouseleave")
    .handler("container_mouseleave")
    .enable();
```

- **Note**: When _any_ filter passes the handler gets invoked.
- **Note**: The `@mouseleave` tells the library to treat the mouseover event as a mouseleave.

<a name="example-mouseover-event"></a>
**Mouseover Event** &mdash; Mouseover event with event delegation.

```js
// Using FunnelJS, filter and return an element which is of tag type "input.
Interaction.addFilter("input_mouseover", function(e, targets) {
    // filter logic
    return Funnel(targets.target)
        .tags("input")
        .getElement();
});
```

```js
Interaction.addHandler("input_mouseover", function(e, targets, filter_name) {
    console.log("Mouseover Input!", filter_name);
    // logic...
});
```

```js
var event = new Interaction("Input Mouseenter")
    .id("intInputMouseenter")
    .on("mouseover")
    .namespace("input")
    .anchors(document)
    .filters("input_mouseover")
    .handler("input_mouseover")
    .enable();
```

<a name="example-click-delegation-1"></a>
**Click Delegation Example 1** &mdash; Click event with event delegation.

```js
// Using FunnelJS, filter and return an element that has the class "cont".
Interaction.addFilter("container_click", function(e, targets) {
    // filter logic
    var parents = Funnel(targets.target)
        .parents()
        .getStack();
    return Funnel(targets.target)
        .concat(parents)
        .classes("cont")
        .getElement();
});
// Using FunnelJS, filter and return an element that has the attribute "[id=input]".
Interaction.addFilter("input_click", function(e, targets) {
    // filter logic
    return Funnel(targets.target)
        .attrs("[id=input]")
        .getElement();
});
```

```js
Interaction.addHandler("container_click", function(e, targets, filter_name) {
    console.log("Container Clicked!", filter_name);
    // logic...
});
```

```js
var event = new Interaction("Main Body Click Interaction")
    .id("intMainBodyClick")
    .on("click")
    .anchors(document)
    .filters("container_click", "input_click")
    .handler("container_click")
    .enable();
```

<a name="example-click-delegation-2"></a>
**Click Delegation Example 2** &mdash; Click event with event delegation.

```js
// Using FunnelJS, filter and return an element that has the class "cont".
Interaction.addFilter("container_click", function(e, targets) {
    // filter logic
    var parents = Funnel(targets.target)
        .parents()
        .getStack();
    return Funnel(targets.target)
        .concat(parents)
        .classes("cont")
        .getElement();
});
```

```js
Interaction.addHandler("second_body_click", function(e, targets, filter_name) {
    console.log("Second Clicked!", filter_name);
    // logic...
});
```

```js
var event = new Interaction("Second Body Click Interaction")
    .on("click")
    .anchors(document)
    .filters("container_click")
    .handler("second_body_click")
    .fireCount(5)
    .enable();
```

<a name="example-triggering"></a>
### Triggering Examples

<a name="triggering-no-delegation"></a>
**No Delegation** &mdash; No target elements just the optional data object.

```js
Interaction.trigger("intCustomEvent", {
    data: [1, 2, 3]
});

Interaction.trigger("intWindowResize", {
    data: Date.now()
});

Interaction.trigger("intBodyMouseWheel"); // no options
```

<a name="triggering-delegation"></a>
**Delegation** &mdash; Make sure to pass the correct target elements.

```js
Interaction.trigger("intMainBodyClick", {
    targets: {
        target: document.getElementById("cont")
    },
    data: {
        "key": "value"
    }
});

Interaction.trigger("intInputMouseenter", {
    targets: {
        target: Funnel(document.body).all().tags("input").getElement()
    }
});
```

<a name="contributing"></a>
### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](https://github.com/cgabriel5/interactionjs/blob/master/CONTRIBUTING.md).

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/interactionjs/blob/master/LICENSE.txt).
