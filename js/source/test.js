document.onreadystatechange = function() {
    "use strict";
    // all resources have loaded (document + subresources)
    if (document.readyState == "complete") {
        // get the libs
        var libs = app.libs,
            Interaction = libs.Interaction,
            Funnel = libs.Funnel;
        // interaction examples
        // Click Event - A simple click event example.
        Interaction.addHandler("container_click", function(e, targets, filter_name) {
            console.log("Container Clicked!", filter_name);
            // logic...
        });
        var event = new Interaction("Container click!")
            .on("click")
            .anchors(Funnel("#cont")
                .getElement())
            .handler("container_click")
            .fireCount(4)
            .enable();
        // Resize Event - Monitor the window for any resizing.
        Interaction.addHandler("window_resize", function(e, targets, filter_name) {
            console.log("Resized!", filter_name);
            // logic...
        });
        var event = new Interaction("Window Resize!")
            .id("intWindowResize")
            .on("resize")
            .anchors(window)
            .handler("window_resize")
            // .throttle(300) // <-- *debounce or throttle heavy interactions*
            // .debounce(300) // <-- *debounce or throttle heavy interactions*
            .fireCount(20)
            .enable();
        // MouseWheel Event - Simple scroll event example.
        Interaction.addHandler("body_mousewheel", function(e, targets, filter_name) {
            console.log("Body MouseWheel!", filter_name);
            // logic...
        });
        var event = new Interaction("Body MouseWheel")
            .id("intBodyMouseWheel")
            .on("mousewheel")
            .anchors(document)
            .handler("body_mousewheel")
            .fireCount(10)
            .enable();
        // Cloning Event - Interactions may also be cloned.
        var event = new Interaction("My Cloned Interaction", "intWindowResize")
            // change any options here...
            .reset("id")
            .id("intWindowResizeClone")
            .enable();
        // Custom Event - Custom events may also be created.
        Interaction.addHandler("custom_event", function(e, targets, filter_name) {
            console.log("Custom Event!", filter_name);
            // logic...
        });
        // Custom Event Example
        var event = new Interaction("Custom Event")
            .id("intCustomEvent")
            .on(":build")
            .anchors(document)
            .handler("custom_event")
            .enable();
        // Event Delegation - Some examples using the library for event delegation.
        // Mouseenter Event - Library provided mouseenter event.
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
        Interaction.addHandler("container_mouseover", function(e, targets, filter_name) {
            console.log("Mouseover!", filter_name);
            // logic...
        });
        var event = new Interaction("Container Mouseenter")
            .on("mouseover")
            .anchors(document)
            .filters("container_mouseover@mouseenter")
            .handler("container_mouseover")
            .enable();
        // Mouseleave Event - Library provided mouseleave event.
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
        Interaction.addHandler("container_mouseleave", function(e, targets, filter_name) {
            console.log("Mouseleave!", filter_name);
            // logic...
        });
        var event = new Interaction("Container Mouseleave")
            .on("mouseout")
            .anchors(document)
            .filters("container_mouseleave@mouseleave")
            .handler("container_mouseleave")
            .enable();
        // Mouseover Event - Mouseover event with event delegation.
        // Using FunnelJS, filter and return an element which is of tag type "input.
        Interaction.addFilter("input_mouseover", function(e, targets) {
            // filter logic
            return Funnel(targets.target)
                .tags("input")
                .getElement();
        });
        Interaction.addHandler("input_mouseover", function(e, targets, filter_name) {
            console.log("Mouseover Input!", filter_name);
            // logic...
        });
        var event = new Interaction("Input Mouseenter")
            .id("intInputMouseenter")
            .on("mouseover")
            .namespace("input")
            .anchors(document)
            .filters("input_mouseover")
            .handler("input_mouseover")
            .enable();
        // Click Delegation Example 1 - Click event with event delegation.
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
        Interaction.addHandler("container_click", function(e, targets, filter_name) {
            console.log("Container Clicked!", filter_name);
            // logic...
        });
        var event = new Interaction("Main Body Click Interaction")
            .id("intMainBodyClick")
            .on("click")
            .anchors(document)
            .filters("container_click", "input_click")
            .handler("container_click")
            .enable();
        // Click Delegation Example 2 - Click event with event delegation.
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
        Interaction.addHandler("second_body_click", function(e, targets, filter_name) {
            console.log("Second Clicked!", filter_name);
            // logic...
        });
        var event = new Interaction("Second Body Click Interaction")
            .on("click")
            .anchors(document)
            .filters("container_click")
            .handler("second_body_click")
            .fireCount(5)
            .enable();
        // Triggering Examples
        // No Delegation - No target elements just the optional data object.
        Interaction.trigger("intCustomEvent", {
            data: [1, 2, 3]
        });
        Interaction.trigger("intWindowResize", {
            data: Date.now()
        });
        Interaction.trigger("intBodyMouseWheel"); // no options
        // Delegation - Make sure to pass the correct target elements.
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
                target: Funnel(document.body)
                    .all()
                    .tags("input")
                    .getElement()
            }
        });
    }
};