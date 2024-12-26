# Dashboard Genie - Customizable Analytics Dashboards

Building a dynamic analytics dashboard? Don't start from scratch. Leverage our CSS Grid-based templates and visualize your data effortlessly.

**UPDATE: All examples have been upgraded to integrate with [keen-dataviz.js](https://github.com/keen/keen-dataviz.js) and [keen-analysis.js](https://github.com/keen/keen-analysis.js), along with CDN dependencies.** With [keen-dataviz.js](https://github.com/keen/keen-dataviz.js), chart wrappers (`.chart-wrapper`) are auto-rendered, simplifying development.

### Get Started:

![Hero Thirds Example](http://cl.ly/image/3v2H180U0k0Q/Screen%20Shot%202014-10-29%20at%203.12.24%20AM.png)

Add charts to designated `chart-stage` elements in your HTML:

```html
<div class="grid-hero">
  <div class="hero chart-wrapper">
    <div class="chart-title">
      Chart Title
    </div>
    <div class="chart-stage">
      <div id="grid-1-1">
        <!-- chart goes here! -->
      </div>
    </div>
    <div class="chart-notes">
      Additional notes (optional)
    </div>
  </div>
</div>
```

Voilà! A polished, responsive analytics dashboard, ready for presentation.

![Sample Dashboard](http://cl.ly/image/1T3a0X402r0W/Screen%20Shot%202014-10-29%20at%203.35.04%20AM.png)

## Templates Overview

Our templates feature minimal, efficient styling to address diverse layout needs, designed for quick customization.

* [Layouts](http://keen.github.io/dashboards/layouts/) - Ready-to-use dashboard views
* [Examples](http://keen.github.io/dashboards/examples/) - Tailored demos for specific data models

## Integrations

These templates work with any data source or charting library. Optimized for [keen-dataviz.js](https://github.com/keen/keen-dataviz.js), charts can be added with minimal code. Reach out to our team to get started.

## How to Use

Follow these steps to start customizing your dashboard:

1. **Download the Repo:** [Download here](https://github.com/keen/dashboards/archive/gh-pages.zip) or use `git clone keen/dashboards`.
2. **Pick a Layout:** Explore [layouts](http://keen.github.io/dashboards/layouts/) and choose one that fits your needs.
3. **Customize the HTML:** Open the `.html` file from the template directory in your favorite editor.

### Editing the Dashboard:

1. **Setup:**
   - If registered with Keen IO, log in [here](http://keen.io/login?s=gh-dashboards). Alternatively, use demo data from the `demo-data` folder.
   - Paste the demo JavaScript into your `.html` file.
2. **Embed Charts:**
   - At the bottom of the HTML file, insert scripts before `</body>`.
3. **Link Charts to Containers:**
   ```html
   <div class="chart-stage" id="chart-01"></div>
   ```
   Replace placeholder images with proper chart containers.

## Docker Setup
Clone the repository:
```
$ git clone https://github.com/keen/dashboards.git
```
Build and run the Docker container:
```
$ cd dashboards
$ docker build -t keen/dashboards .
$ docker run -d -p 80:80 keen/dashboards
```

## Contributing

Contributions are highly encouraged!

Report issues or submit pull requests for features and bug fixes.

To develop, install dependencies with [Bower](http://bower.io/):
```
$ npm install -g bower
$ bower install
```

Stay updated by syncing with the upstream repo:
```
$ git clone https://github.com/keen/dashboards.git
$ cd dashboards
$ git remote add upstream https://github.com/keen/dashboards.git
$ git pull upstream gh-pages
```



