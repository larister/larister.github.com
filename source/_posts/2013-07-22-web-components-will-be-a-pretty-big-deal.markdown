---
layout: post
title: "Web Components will be a Pretty Big Deal"
date: 2013-07-22 21:48
comments: true
categories:
---

Last Wednesday I was lucky enough to attend a fascinating evening at Google, London. [Glenn Jones][glenn] kindly invited me to join him at an event on [Web Components][webcomponents] and [Polymer][polymer].

The Polymer team have been quietly working on their baby for the last three years, but it is only starting to emerge into the limelight now.

# Web Components

The core philosophy behind Web Components is to make markup meaningful again. They want to give you the ability to build your own HTML elements. For the most obvious example of this, fire up Google Chrome and add an ```<input type="date">``` tag:

<input type="date">

See how it's rendered? It's a fully functional widget, with the ability to increment/decrement values and even open up a calendar view.

Right click and inspect element. What do you see? Still the same old input tag. Now click on the little cog at the bottom right of the dev tools and click on 'Show Shadow DOM'. Reboot the dev tools and behold! Now you have a grey ```#document-fragment``` within the input tag which shows you all the inner workings of the element.

This is a perfect example of a custom element. It has its own encapsulated styling and JavaScript behaviour, and is entirely reusable. Web Components releases this awesome power from the clutches of the browser vendors and opens it up to all.

# Polymer

So what is Polymer? It is Google's implementation of Web Components, and it sits on a collection of polyfills which make the technology possible on today's browsers. This collection of polyfills is called 'platform.js', and includes:

- Custom Elements
- Shadow DOM
- HTML Imports
- Model Driven Views

It also includes a couple of polyfills for Web Animations and Pointer Events. These aren't directly related to Web Components, but are still great shims in their own right and show that the Polymer team are working hard to bring the future of the web ever closer. Each polyfill can also be included/excluded as needed. As with all polyfills, they will become less and less necessary over time as standards are implemented.

Let's take a quick gander at each of these polyfills for Web Components.

## Custom Elements

This is what allows you to register your own HTML element. Ever wanted to have your own ```<this-guy>``` tag with two ```<thumb>``` tags? Now you can. What's more, your ```<this-guy>``` tag can have it's own fully encapsulated JavaScript.

As this JavaScript is not exposed to the outside world, there are some interesting side effects. Notably, inline handlers such as click may come back into fashion. Before you gasp, think about the original reasoning behind separating out behaviour from the DOM. It was (at least partly) to avoid the use of global functions. But when your code is isolated in its own little sandbox, this concern melts away. What's more, you can do away with the messy business of adding and removing event listeners.

The same goes for CSS as well, no more big long selectors to drill down through the tree to the exact element you want. You are able to allow the outside world to style some or all of your custom element, but the choice and control is yours. For me, this encapsulation of JS and CSS is the most revolutionary part of Web Components, and I am deeply excited about it.

## Shadow DOM

The Shadow DOM encapsulates the innards of your custom element and just exposes a nice clean tag for you to plonk on your page. This tag can even have child nodes; the contents of which can be accessed and mashed into your custom element. Check out Google's example:

What the user writes:

```
<my-custom-element>
  <q>Hello World</q>
</my-custom-element>
```

Your Shadow DOM:

```
<shadow-root>
  <span>People say: <content></content></span>
</shadow-root>
```

The resulting HTML:

```
<my-custom-element>
  <span>People say: <q>Hello World</q></span>
</my-custom-element>
```

Dumping out the content of the my-custom-element tag is the most simple example, but it is a very flexible framework. You can use CSS selectors to grab out exactly the parts you want and insert them where appropriate.

Of course, these reusable and encapsulated elements can be compounded to make ever more complex elements, until you have an entire webapp just represented as ```<my-webapp>```. Although this might seem anathema to some, remember that entire webapps are currently being built with no elements on the page whatsoever, in arbritrary ways. The Shadow DOM and custom elements at least provide standardisation, plus the ability to drill down into the building blocks using Dev Tools.

## HTML Imports

So you've got your nice new shiny element. It is defined in its own file, with a script tag and styles inside. Now how to get the thing into your page? Unsurprisingly, it's using the new HTML Import functionality. As you'd expect, this is as simple as adding a script or a stylesheet to a page; indeed it uses the ```<link>``` tag:

```<link rel="import" href="import-file.html">```

Job done!

## Model Driven Views

MDV (Model Driven Views) is the only part of the spec currently assigned an Implementation Status of 'In progress'. However, it is certainly far enough along to get a good idea of what it will offer. Essentially, MDV standardises the ubiquitous task of generating HTML using templates and data from a model.

If you've ever used mustache or a similar technology, you'll be right at home with HTML templates. They look just the same, however they can live directly on the DOM. Crucially, though, they are parsed and not rendered. This means that you cannot access the innards of an HTML template via JavaScript, nor will any CSS or JavaScript be evaluated until it is stamped out onto the page.

MDVs are not simply templates, however. The HTML generated from the templates includes a property called "templateInstance" which stores a reference to the data used to create the template.

This means that whenever the data changes, so does the generated HTML. It even works vice versa, if a user enters a value into an input in your template which is bound to an attribute in your model, that model will get updated instantly.

MDV obviously doesn't offer anything that a myriad of frameworks and libraries already offer, but it sure will be nice to have it standardised.

***

# Summing Up

Polymer is a mind-boggling concept when you get your head round it. It is not a replacement for Backbone, Angular or other frameworks, but it will drastically change the way they work and the way we think about web applications for the better. The ability to build a webapp piece by piece with custom elements building on top of each other, each standalone and encapsulated is deeply exciting and feels like the right direction to be heading in.

There are some niggles still. Polyfills often support legacy browsers, however if you need to support IE 8 then you're out of luck. Even IE 9 isn't officially supported.

There is also a healthy ongoing discussion over how this technology should be structured. Should data be a separate tag? Should JavaScript and styling be external to the HTML file where your custom element is defined, or should it all go in one file ('Taco-style' as the team evocatively call it)? What will the distribution and repository system look like?

I'm also slightly wary of the 'everything is an element' approach. I'm completely onboard with actual custom components, but during the demonstration the Polymer team showed how Web Animations (which I haven't covered here) will look. Each transition was a new HTML element, and personally I found it harder to grok than animations defined using JavaScript; it felt worryingly like a return to XML definitions. The team reassured me that imperative declarations would be supported, but they also made it clear that the HTML element approach was preferred.

However, this is a new and constantly changing technology. It seems to have changed fairly significantly even since the GoogleIO presentations, styling syntax in particular. What I've discussed here is also only a small fraction of the project, head over to <http://www.polymer-project.org>, and make sure to watch the two videos below which give a more comprehensive introduction to Polymer and Web Components. Lastly, [download the code][downloadCode], [join the mailing list][mailingList] and make your voice heard!

***

<iframe width="560" height="315" src="//www.youtube.com/embed/fqULJBBEVQE" frameborder="0" allowfullscreen></iframe>

***

<iframe width="560" height="315" src="//www.youtube.com/embed/0g0oOOT86NY" frameborder="0" allowfullscreen></iframe>

[glenn]: https://twitter.com/glennjones
[webcomponents]: http://www.w3.org/TR/2013/WD-components-intro-20130606/
[polymer]: http://www.polymer-project.org/
[downloadCode]: https://github.com/polymer/polymer
[mailingList]: http://www.polymer-project.org/discuss.html