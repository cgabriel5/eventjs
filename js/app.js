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
            var parents = Funnel(targets.target).parents().getStack();
            return Funnel(targets.target).concat(parents).classes("cont").getElement();
        });
        Interaction.addFilter("input_click", function(e, targets) {
            // filter logic
            return Funnel(targets.target).attrs("[id=input]").getElement();
        });
        Interaction.addFilter("cont_mouseover", function(e, targets) {
            // filter logic
            var parents = Funnel(targets.target).parents().getStack();
            return Funnel(targets.target).concat(parents).classes("cont").getElement();
        });
        Interaction.addFilter("cont_mouseleave", function(e, targets) {
            // filter logic
            var parents = Funnel(targets.target).parents().getStack();
            return Funnel(targets.target).concat(parents).classes("cont").getElement();
        });
        Interaction.addFilter("input_mouseover", function(e, targets) {
            // filter logic
            return Funnel(targets.target).tags("input").getElement();
        });

        // register event handlers

        Interaction.addHandler("window_resize", function(e, targets, filter_name) {
            console.log("Resized!", filter_name);
        });
        Interaction.addHandler("main_body_click", function(e, targets, filter_name) {
            console.log("Clicked!", filter_name);
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

        // create new interactions

        new Interaction("Window Resize!")
            .id("test123")
            .on("resize")
            .anchors(window)
            .handler("window_resize")
            // .throttle(3000)
            // .debounce(300)
            .fireCount(250)
            .enable();

        new Interaction("Main Body Click Interaction")
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
            .on("mouseover")
            .namespace("input")
            .anchors(document)
            .filters("input_mouseover")
            .handler("input_mouseover")
            .enable();

    }

};
