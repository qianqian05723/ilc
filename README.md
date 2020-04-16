![Isomorphic Layout Composer logo](brand/cover_small.png)

----

[![Actions Status](https://github.com/namecheap/ilc/workflows/Registry/badge.svg)](https://github.com/namecheap/ilc/actions)
[![Actions Status](https://github.com/namecheap/ilc/workflows/ILC/badge.svg)](https://github.com/namecheap/ilc/actions)
[![Docker Pulls](https://img.shields.io/docker/pulls/namecheap/ilc?logo=docker&logoColor=white)](https://hub.docker.com/r/namecheap/ilc)

Isomorphic Layout Composer (ILC) - layout service that compose a web page from fragment services. 
It supports client/server based page composition.

It's key difference and advantage against other solutions lays in the fact that it does page composition isomorphically.
It means that page will be assembled at server side using apps that support server side rendering (SSR) and after that 
it will be hydrated at client side so all further navigation will be handled by client side rendering.

Such approach allows to **combine advantages of the 
[Micro Frontends](https://martinfowler.com/articles/micro-frontends.html), 
[SPA](https://en.wikipedia.org/wiki/Single-page_application) & 
[Server Side Rendering](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering) approaches**.

This repository also contains an example of how you can create a front-end that is composed from multiple 
applications which work in concert and deliver unified experience.

## Why do I need ILC?

Microservices get a lot of traction these days. They allow multiple teams to work independently from each other, choose 
their own technology stacks and establish their own release cycles. Unfortunately, frontend development hasn’t fully capitalized 
yet on the benefits that microservices offer. The common practice for building websites remains “the monolith”: a single frontend 
codebase that consumes multiple APIs.

What if we could have microservices on the frontend? This would allow frontend developers to work together with their backend 
counterparts on the same feature and independently deploy parts of the website — “fragments” such as Header, Product, and Footer. 
Bringing microservices to the frontend requires a layout service that composes a website out of fragments. ILC was developed to solve this need.

## Key features

* 📦 **Based on [single-spa](https://single-spa.js.org/) & [TailorX](https://github.com/StyleT/tailorx)** - battle tested solutions inside
* 📱 **Technology Agnostic** - use it with React, Vue.js, Angular, etc...
* ⚙️ **Server Side Rendering support** - key advantage over competitors
* 🗄 **Built-in registry** - add new apps, pages or change configs and templates in few clicks
* ⚡️ **Built for speed** - server side part of the system adds just ~17ms of latency
* 👨‍💻 **Develop right at production** - [Doc](https://github.com/namecheap/ilc/blob/master/docs/develop_at_production.md)
* 💲 **Baked by [Namecheap](https://www.namecheap.com/about/mission-vision-values/)** - we use it internally and plan to evolve it together with community

## 🚀 Quick start
1. Clone this repository
1. Run `docker-compose up -d`
1. _During first launch or shutdown only._ Run `docker-compose run registry npm run seed`
1. PROFIT 😎
    * View logs via `docker-compose logs -f --tail=10`
    * Open ILC at http://localhost:8233/
    * Open Registry UI at http://localhost:4001/ & use `root/pwd` credentials to sign in.
    * Shutdown everything with `docker-compose down`

More information about demo applications used in this quick start [you can find here](https://github.com/namecheap/ilc-demo-apps).

## Architecture overview

![ILC Architecture overview](docs/assets/ILC-Architecture.svg)

## Repo structure
```
|– ilc: code of the Isomorphic Layout Composer
|– registry: app that contains configuration used by ILC. Such as list of micro-fragments, routes, etc...
```

## Further reading

* [ILC to App interface](docs/ilc_app_interface.md)
* [Demo applications used in quick start](https://github.com/namecheap/ilc-demo-apps)

## 🔌 Adapters
To conveniently connect various frameworks to ILC we rely on the [ecosystem of the single-spa](https://single-spa.js.org/docs/ecosystem)
provided adapters. However sometimes we need to extend original ones to deliver better integration with ILC. 
Here are the list of the adapters that were forked & modified:

*  [Vue.js - ilc-adapter-vue](https://github.com/namecheap/ilc-adapter-vue)

## Notes

### Why `@portal/`
We're using webpack (a static module bundler) to build each application for our micro-frontend approach. Webpack requires
access to everything it needs to include in the bundle at build time. This means when an app that imports a service,
for example planets importing the fetchWithCache service, webpack will try to bundle the service into the planets bundle.
The built in way to avoid webpack doing this is [webpack externals](https://webpack.js.org/configuration/externals/), 
using externals works really well but to avoid having to include a regex for each service I'm using the postfix to signal 
to webpack (and developers) that the import is another micro-app/service/front-end. The prefix isn't required if you 
would rather include a different postfix or none at all it should work, you'll just have to modify each webpack config 
for externals.

### Code splitting
Code splitting is a complicated topic. I'm not going to dive into each facet of it within Webpack, see [Webpacks docs for 
that](https://webpack.js.org/guides/code-splitting/).

In our project code splitting is further complicated because webpack's module format expects to load more modules from 
the website root, which will always fail in this project unless webpack is told where to load additional modules. Right
now there is a single example of this, [done in the people application](./devFragments/people/src/people.js#L10).
