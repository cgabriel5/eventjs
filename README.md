# events (interactionjs)

Small library for event handling.

##### Table of Contents

[What It Does](#what-it-does)  
[Add To Project](#add-to-project)  
[Access Library](#access-library)  
[Instance Creation](#instance-creation)  
[API](#api)  
* [Global Methods](#global-methods)  
* [Instance Methods](#instance-methods)  

[Usage](#usage)  

[Contributing](#contributing)  
[License](#license)  

<a name="what-it-does"></a>
### What It Does

* Create/manage/disable/enable events
* List all events made

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
var interaction = new Interaction();

// Using the "new" keyword is not necessary. If not used
// the library will make sure to use it for you.
var interaction = Interaction();

// **Note: Interaction name can also be provided upon instance creation.
// This is not necessary. This only serves as feedback to identify what 
// the interaction is for.
var interaction = new Interaction("Main Body Click.");
```

<a name="api"></a>
### API

<a name="global-methods"></a>
#### Global Methods

**Interaction.interactions** &mdash; Returns an array of all the created interactions.

```js
Interaction.interactions();
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

**Interaction.addHandler** &mdash; Adds a filter to the internal handlers registry.

```js
Interaction.addHandler("filer_name", function(e) { /*logic*/ });
```

**Interaction.removeHandler** &mdash; Removes a filter from the internal handlers registry.

```js
Interaction.removeHandler("filer_name");
```

<a name="instance-methods"></a>
### Instance Methods

**interaction.id** &mdash; Set the interaction ID.

```js
// **Note: The provided ID must be unique.
// The ID is optional and only needed if wanted to access the instance
// from the list of created instances.
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

**interaction.filters** &mdash; If using event delegation, filters can be used
filter out the wanted element(s).

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

Note: The filters in these examples use [FunnelJS](https://github.com/cgabriel5/funneljs). [FunnelJS](https://github.com/cgabriel5/funneljs) is a simple, standalone, lightweight JavaScript selector engine. Its use in these examples is to filter out the target element(s) provided to it. Although used, it is not necessary as the filtering can be done using VanillaJS. The library is just very useful for things like event delegation.

<a name="contributing"></a>
### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](https://github.com/cgabriel5/interactionjs/blob/master/CONTRIBUTING.md).

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/interactionjs/blob/master/LICENSE.txt).
