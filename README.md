# events (interactionjs)

Small library for event handling.

##### Table of Contents

[What It Does](#what-it-does)  
[Add To Project](#add-to-project)  
[Access Library](#access-library)  
[Instance Creation](#instance-creation)  
[API](#api)  
* [Global](#global-api)
    * [QuickTable](#global-quicktable-reference)  
    * [Methods](#global-methods-long)  
* [Instance](#instance-api)
    * [QuickTable](#instance-quicktable-reference)  
    * [Methods](#instance-methods-long) 

[Usage](#usage)  

[Contributing](#contributing)  
[License](#license)  

<a name="what-it-does"></a>
### What It Does

* Create, Remove, Manage (list / disable / enable / trigger) events

<a name="add-to-project"></a>
### Add To Project

```html
<script src="my_js_directory_path/interaction.js"></script>
```

<a name="access-library"></a>
### Access Library

```js
var Interaction = window.app.libs.Interaction;
```

<a name="instance-creation"></a>
### Instance Creation

```js
var interaction = new Interaction(<p1>, <p2>);
// p1: Optional Interaction Name
// p2: ID of Interaction To Clone Options Of

// Using the "new" keyword is not necessary. If not used
// the library will make sure to use it for you.
var interaction = Interaction();

// **Note: Interaction name can also be provided upon instance creation.
// This is not necessary. This only serves as feedback to identify what 
// the interaction is for.
var interaction = new Interaction("Main Body Click.");

// Will clone the options off the interaction with the ID of "custom".
// In the case some options need to be reset/replaced/updated use the 
// reset method.
var interaction = new Interaction("Main Body Click.", "custom")
    .reset("id") // reset the id
    .id("test456") // add new ID
    .enable();
```

<a name="api"></a>
### API
 
<a name="global-api"></a>
### API &mdash; Global

<a name="global-quicktable-reference"></a>
### Global QuickTable Reference

Method | Function
------------ | -------------
**interactions** | Returns an array of all the created interactions
**interactionsFor** | Returns all interactions where the provided element was used as an anchor
**trigger** | Triggers an interaction
**disableAll** | Disables all interactions
**enableAll** | Enables all interactions
**remove** | Removes interaction with matching provided ID
**removeAll** | Removes all interactions
**handlers** | Returns an object containing all the handlers
**filters** | Returns an object containing all the filters
**addFilter** | Adds a filter to the internal filters registry
**removeFilter** | Removes a filter from the internal filters registry
**addHandler** | Adds a handler to the internal handlers registry
**removeHandler** | Removes a handler from the internal handlers registry

<a name="global-methods-long"></a>
### Global Methods

**Interaction.interactions** &mdash; Returns an array of all the created interactions.

```js
Interaction.interactions();
```

**Interaction.interactionsFor** &mdash; Returns all interactions where the provided element was used as an anchor.

```js
Interaction.interactionsFor(document);
Interaction.interactionsFor(window);
Interaction.interactionsFor(document.getElementById("container"));
```

**Interaction.trigger** &mdash; Triggers an interaction.

```js
// signature
Interaction.trigger("interaction_id", options);

// possible options (optional)
var options = {
    // if using event delegation, provide the correct target elements so 
    // that the events function as if they were naturally triggered.
    // these target elements will be passed to interactions filter functions.
    "targets": {
        "target": document.getElementById("cont"),
        // "currentTarget": <ElementNode>,
        // "relatedTarget": <ElementNode>,
        // "srcElement": <ElementNode>,
        // "fromElement": <ElementNode>,
        // "toElement": <ElementNode>,
        // "explicitOriginalTarget": <ElementNode>,
        // "originalTarget": <ElementNode>
    },
    // event options
    "options": { "bubbles": true, "cancelable": false, "scoped": false, "composed" },
    // if the event is a custom event data can be provided,
    // whatever can be passed as data
    "data": { "key": "value" }
};

// trigger examples (no delegation)
Interaction.trigger("custom", { data: [1, 2, 3] });
Interaction.trigger("test123", { data: Date.now() });
Interaction.trigger("scroll"); // no options

// trigger examples (with delegation)
var $cont = document.getElementById("cont");
Interaction.trigger("bodyClick", {
    targets: {
        target: $cont
    },
    data: { "key": "value" }
});
var $first_input = Funnel(document.body).all().tags("input").getElement();
Interaction.trigger("mouseenter", {
    targets: {
        target: $first_input
    }
});
```

**Interaction.disableAll** &mdash; Disables all interactions.

```js
Interaction.disableAll();
```

**Interaction.enableAll** &mdash; Enables all interactions.

```js
Interaction.enableAll();
```

**Interaction.remove** &mdash; Removes interaction with matching provided ID.

```js
Interaction.remove("interaction_id");
```

**Interaction.removeAll** &mdash; Removes all interactions.

```js
Interaction.removeAll();
```

**Interaction.handlers** &mdash; Returns an object containing all the handlers.

```js
Interaction.handlers();
```

**Interaction.filters** &mdash; Returns an object containing all the filters.

```js
Interaction.filters();
```

**Interaction.addFilter** &mdash; Adds a filter to the internal filters registry.

```js
Interaction.addFilter("filer_name", function(e) { /*logic*/ });
```

**Interaction.removeFilter** &mdash; Removes a filter from the internal filters registry.

```js
Interaction.removeFilter("filer_name");
```

**Interaction.addHandler** &mdash; Adds a handler to the internal handlers registry.

```js
Interaction.addHandler("filer_name", function(e) { /*logic*/ });
```

**Interaction.removeHandler** &mdash; Removes a handler from the internal handlers registry.

```js
Interaction.removeHandler("filer_name");
```

<a name="instance-api"></a>
### API &mdash; Instance

<a name="instance-quicktable-reference"></a>
### Instance QuickTable Reference

Method | Function
------------ | -------------
**id** | Set the interaction ID
**on** | The events to listen for
**namespace** | The namespace the events should be under
**anchors** | The elements to attach the events to
**filters** | If using event delegation, filters can be used to filter out the wanted element(s)
**fireCount** | The amount of times the handler should fire
**capture** | Should the event capture
**capture** | Should the event be passive
**debounce** | Should the event be debounced
**throttle** | Should the event be throttled
**handler** | The event handler
**enable** | Enables the event
**disable** | Disables the event
**remove** | Removes the event

<a name="instance-methods-long"></a>
### Instance Methods

**interaction.id** &mdash; Set the interaction ID.

```js
// **Note: The provided ID must be unique.
// The ID is optional and only needed if wanted to access the instance
// sometime later to remove, enable/disable, trigger, etc. the interaction.
interaction.id("some_unique_id");
```

**interaction.on** &mdash; The events to listen for.

```js
// N amount of events can be passed in.
interaction.on("click", "wheel");
```

**interaction.namespace** &mdash; The namespace the events should be under.

```js
// Providing a namespace is optional.
interaction.namespace("namespace1.namespace2.namespaceN");
```

**interaction.anchors** &mdash; The elements to attach the events to.

```js
// N amount of elements can be passed in.
var $cont = document.getElementById("cont");
interaction.anchors(document, window, $cont);
```

**interaction.filters** &mdash; If using event delegation, filters can be used to filter out the wanted element(s).

```js
// N amount of filters can be passed in.
interaction.filters("filter1", "filter2");
```

**interaction.fireCount** &mdash; The amount of times the handler should fire.
If not provided the count is set to `Infinity`.

```js
interaction.fireCount(1); // fire once
// **Note: Once the count reaches zero the event gets automatically removed.
```

**interaction.capture** &mdash; Should the event capture?

```js
interaction.capture(true);
```

**interaction.capture** &mdash; Should the event be passive?

```js
interaction.passive(true);
```

**interaction.debounce** &mdash; Should the event be debounced?

```js
// **Note: The event can be throttled or debounced but not both.
interaction.debounced(250);
```

**interaction.throttle** &mdash; Should the event be throttled?

```js
// **Note: The event can be throttled or debounced but not both.
interaction.throttled(250);
```

**interaction.handler** &mdash; The event handler.

```js
interaction.handler("handler1");
```

**interaction.enable** &mdash; Enables the event.

```js
interaction.enable();
```

**interaction.disable** &mdash; Disables the event.

```js
interaction.disable(); // mutes event
```

**interaction.remove** &mdash; Removes the event.

```js
// **Note: This will unbind all events from anchors and remove the 
// interaction from the internal registry. In essence, the interaction
// is no longer tracked/accounted for.
interaction.remove();
```

<a name="usage"></a>
### Usage

For a better understanding check out `index.html` and `app.js`. `app.js` contains examples showing how the library is used.

**Note:** The filters in these examples use [FunnelJS](https://github.com/cgabriel5/funneljs). [FunnelJS](https://github.com/cgabriel5/funneljs) is a simple, standalone, lightweight JavaScript selector engine. Its use in these examples is to filter out the target element(s) provided to it. Although used, it is not necessary as the filtering can be done using VanillaJS. The library is just very useful for things like event delegation.

<a name="contributing"></a>
### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](https://github.com/cgabriel5/interactionjs/blob/master/CONTRIBUTING.md).

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/interactionjs/blob/master/LICENSE.txt).
