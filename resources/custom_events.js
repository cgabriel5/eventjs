// event reference: [https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events]

// make a custom event with no custom data
// [https://developer.mozilla.org/en-US/docs/Web/API/Event/Event]
var event = new Event("build", { "bubbles": true, "cancelable": false, "scoped": false, "composed": false });
// need to pass data to custom event? then use the CustomEvent constructor...
var event = new CustomEvent("build", { "bubbles": true, "cancelable": false, "detail": [1, 2, 3] });

// Listen for the event.
document.addEventListener("build", function(e) {
    console.log("The custom build function was triggered!", e.detail);
}, false);

// dispatch the event and check if preventDefault was called
var cancelled = !document.dispatchEvent(event);
if (cancelled) {
    // A handler called preventDefault
    alert("canceled");
} else {
    // None of the handlers called preventDefault
    alert("not canceled");
}

// native events to support triggering
// initUIEvent, initMouseEvent, initEvent
// ff also supports initNSMouseEvent

// triggering custom events: [https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events]

// old-fashion method
// Create the event.
var event = document.createEvent('Event');
// Define that the event name is 'build'.
event.initEvent('build', true, true);
// Listen for the event.
elem.addEventListener('build', function(e) {
    // e.target matches elem
}, false);
// target can be any Element or other EventTarget.
elem.dispatchEvent(event);

// https://developer.mozilla.org/en-US/docs/Web/Events
// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
// https://msdn.microsoft.com/en-us/library/dn905219(v=vs.85).aspx
// https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
// https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent#Notes
// https://developer.mozilla.org/en-US/docs/Web/API/Event
// https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
// https://davidwalsh.name/customevent
// https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter
// Node.isSameNode() -> {https://developer.mozilla.org/en-US/docs/Web/API/Node/isSameNode}
// Node.isEqualNode() -> {https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode}
// Node.contains() -> {https://developer.mozilla.org/en-US/docs/Web/API/Node/contains}
