document.onreadystatechange = function() {
    "use strict";
    // all resources have loaded (document + subresources)
    if (document.readyState == "complete") {
        // get the libs
        var libs = app.libs,
            Interaction = libs.Interaction,
            Funnel = libs.Funnel;
        // register delegation filters
        Interaction.addFilter("main_body_click", function(e, targets) {
            // filter logic
            var parents = Funnel(targets.target)
                .parents()
                .getStack();
            return Funnel(targets.target)
                .concat(parents)
                .classes("cont")
                .getElement();
        });
        Interaction.addFilter("input_click", function(e, targets) {
            // filter logic
            return Funnel(targets.target)
                .attrs("[id=input]")
                .getElement();
        });
        Interaction.addFilter("cont_mouseover", function(e, targets) {
            // filter logic
            var parents = Funnel(targets.target)
                .parents()
                .getStack();
            return Funnel(targets.target)
                .concat(parents)
                .classes("cont")
                .getElement();
        });
        Interaction.addFilter("cont_mouseleave", function(e, targets) {
            // filter logic
            var parents = Funnel(targets.target)
                .parents()
                .getStack();
            return Funnel(targets.target)
                .concat(parents)
                .classes("cont")
                .getElement();
        });
        Interaction.addFilter("input_mouseover", function(e, targets) {
            // filter logic
            return Funnel(targets.target)
                .tags("input")
                .getElement();
        });
        // register event handlers
        Interaction.addHandler("cont_click", function(e, targets, filter_name) {
            console.log("Container Clicked!", filter_name, "EventObjects:", [e, targets]);
        });
        Interaction.addHandler("window_resize", function(e, targets, filter_name) {
            console.log("Resized!", filter_name);
        });
        Interaction.addHandler("main_body_click", function(e, targets, filter_name) {
            console.log("Clicked!", filter_name, "EventObjects:", [e, targets]);
        });
        Interaction.addHandler("second_body_click", function(e, targets, filter_name) {
            console.log("Second Clicked!", filter_name);
        });
        Interaction.addHandler("body_mouswheel", function(e, targets, filter_name) {
            console.log("Body scroll!", filter_name);
        });
        Interaction.addHandler("cont_mouseover", function(e, targets, filter_name) {
            console.log("Mouseover!", filter_name);
        });
        Interaction.addHandler("cont_mouseleave", function(e, targets, filter_name) {
            console.log("Mouseout!", filter_name);
        });
        Interaction.addHandler("input_mouseover", function(e, targets, filter_name) {
            console.log("Mouseover Input!", filter_name);
        });
        Interaction.addHandler("custom_event", function(e, targets, filter_name) {
            console.log("Custom Event!", filter_name, "EventObjects:", [e]);
        });
        // create new interactions
        new Interaction("Container click!")
            .on("click")
            .anchors(window.app.libs.Funnel("#cont")
                .getElement())
            .handler("cont_click")
            .fireCount(4)
            .enable();
        new Interaction("Window Resize!")
            .id("intWindowResize")
            .on("resize")
            .anchors(window)
            .handler("window_resize")
            // .throttle(3000) // <-- *debounce or throttle heavy interactions*
            // .debounce(300) // <-- *debounce or throttle heavy interactions*
            .fireCount(20)
            .enable();
        // A Cloned Interaction
        new Interaction("My Cloned Interaction", "intWindowResize")
            // change any options here...
            .reset("id")
            .id("intWindowResizeClone")
            .enable();
        new Interaction("Main Body Click Interaction")
            .id("intMainBodyClick")
            .on("click")
            .anchors(document)
            .filters("main_body_click", "input_click")
            .handler("main_body_click")
            // .fireCount(2)
            .enable();
        new Interaction("Second Body Click Interaction")
            .on("click")
            .anchors(document)
            .filters("main_body_click")
            .handler("second_body_click")
            .fireCount(5)
            .enable();
        new Interaction("Body Scroll")
            .id("intBodyScroll")
            .on("mousewheel")
            .anchors(document)
            .handler("body_mouswheel")
            .fireCount(10)
            .enable();
        new Interaction("Container Mouseenter")
            .on("mouseover")
            .anchors(document)
            .filters("cont_mouseover@mouseenter")
            .handler("cont_mouseover")
            .enable();
        new Interaction("Container Mouseleave")
            .on("mouseout")
            .anchors(document)
            .filters("cont_mouseleave@mouseleave")
            .handler("cont_mouseleave")
            .enable();
        new Interaction("Input Mouseenter")
            .id("intInputMouseenter")
            .on("mouseover")
            .namespace("input")
            .anchors(document)
            .filters("input_mouseover")
            .handler("input_mouseover")
            .enable();
        // Custom Event Example
        new Interaction("Custom Event")
            .id("intCustomEvent")
            .on(":build")
            .anchors(document)
            .handler("custom_event")
            .enable();
    }
    // trigger examples (no delegation)
    window.app.libs.Interaction.trigger("intCustomEvent", {
        data: [1, 2, 3]
    });
    window.app.libs.Interaction.trigger("intWindowResize", {
        data: Date.now()
    });
    window.app.libs.Interaction.trigger("intBodyScroll"); // no options
    // trigger examples (with delegation)
    var $cont = document.getElementById("cont");
    window.app.libs.Interaction.trigger("intMainBodyClick", {
        targets: {
            target: $cont
        },
        data: {
            "key": "value"
        }
    });
    var $first_input = window.app.libs.Funnel(document.body)
        .all()
        .tags("input")
        .getElement();
    window.app.libs.Interaction.trigger("intInputMouseenter", {
        targets: {
            target: $first_input
        }
    });
};
