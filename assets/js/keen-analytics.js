! function (trackerName, scriptUrl, context) {
  var latestVersion, previousInstance = trackerName !== 'Keen' && window.Keen ? window.Keen : false;

  context[trackerName] = context[trackerName] || {
    initialize: function (callback) {
      var headElem = document.getElementsByTagName('head')[0],
        scriptElem = document.createElement('script'),
        win = window,
        isLoaded;

      scriptElem.onload = scriptElem.onerror = scriptElem.onreadystatechange = function () {
        if ((scriptElem.readyState && !(/^c|loade/.test(scriptElem.readyState))) || isLoaded) {
          return;
        }
        scriptElem.onload = scriptElem.onreadystatechange = null;
        isLoaded = 1;
        latestVersion = win.Keen;

        if (previousInstance) {
          win.Keen = previousInstance;
        } else {
          try {
            delete win.Keen;
          } catch (error) {
            win.Keen = undefined;
          }
        }
        context[trackerName] = latestVersion;
        context[trackerName].initialize(callback);
      };

      scriptElem.async = true;
      scriptElem.src = scriptUrl;
      headElem.parentNode.insertBefore(scriptElem, headElem);
    }
  };
}('KeenMetrics', 'https://cdn.jsdelivr.net/npm/keen-tracking@4', this);

KeenMetrics.initialize(function () {
  var analytics = new KeenMetrics({
    projectId: '5368fa5436bf5a5623000000',
    writeKey: '725f3a571824d9c29f6e4d1c39af349a114d9034f8e493f95d39802529e2ccbb174033077bdcf10b541dbb50c20105922c59bbe1fe7741cb4b632dd0bc84fe98c0b591e17da3d429ef867cc674be0ad20ad768a5210662d2d18ff5492f37a1f91ce697a5489064bb3fa95c827b6cb394'
  });

  analytics.recordEvent('page_visit', {
    page: {
      title: document.title,
      domain: document.location.host,
      url: document.location.href,
      route: document.location.pathname,
      protocolType: document.location.protocol.replace(/:/g, ''),
      searchQuery: document.location.search
    },
    visitorInfo: {
      source: document.referrer,
      ip: '${keen.ip}', 
      agent: '${keen.user_agent}'  
    },
    keenMeta: {
      timestamp: new Date().toISOString(),
      addons: [
        {
          name: 'keen:ip_to_geo',
          input: {
            ip: 'visitorInfo.ip'
          },
          output: 'visitorInfo.location'
        },
        {
          name: 'keen:ua_parser',
          input: {
            ua_string: 'visitorInfo.agent'
          },
          output: 'visitorInfo.device'
        }
      ]
    }
  });
});
