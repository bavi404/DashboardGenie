const keenClient = new Keen({
  projectId: '5337e28273f4bb4499000000',
  readKey: '8827959317a6a01257bbadf16c12eff4bc61a170863ca1dadf9b3718f56bece1ced94552c6f6fcda073de70bf860c622ed5937fcca82d57cff93b432803faed4108d2bca310ca9922d5ef6ea9381267a5bd6fd35895caec69a7e414349257ef43a29ebb764677040d4a80853e11b8a3f'
});

const geoClient = new Keen({
  projectId: '53eab6e12481962467000000',
  readKey: 'd1b97982ce67ad4b411af30e53dd75be6cf610213c35f3bd3dd2ef62eaeac14632164890413e2cc2df2e489da88e87430af43628b0c9e0b2870d0a70580d5f5fe8d9ba2a6d56f9448a3b6f62a5e6cdd1be435c227253fbe3fab27beb0d14f91b710d9a6e657ecf47775281abc17ec455'
});

Keen.ready(() => {
  const tabs = document.querySelector('.nav-tabs');
  const tabMapping = {
    visitors: document.getElementById('tab-visitors'),
    browsers: document.getElementById('tab-browsers'),
    geography: document.getElementById('tab-geography')
  };
  let currentRequest;

  // Chart Instances
  const charts = {
    visitors: createChart('#visitors', 'Monthly Visits', 'area'),
    browsers: createChart('#browser', 'Browser Usage', 'line'),
    geography: createChart('#geography', 'Geographical Data', 'horizontal-bar')
  };

  // Event Listeners for Tabs
  tabs.addEventListener('click', handleTabSwitch);
  tabMapping.visitors.addEventListener('click', () => activateTab('visitors'));
  tabMapping.browsers.addEventListener('click', () => activateTab('browsers'));
  tabMapping.geography.addEventListener('click', () => activateTab('geography'));

  activateTab('visitors');

  // Tab Handler
  function handleTabSwitch(e) {
    const selectedTab = e.target;
    if (selectedTab.hash) {
      switchActivePane(selectedTab);
    }
  }

  function switchActivePane(tab) {
    document.querySelectorAll('.nav-tabs li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.tab-content .tab-pane').forEach(pane => pane.classList.remove('active'));

    tab.parentNode.classList.add('active');
    document.querySelector(tab.hash).classList.add('active');
  }

  function activateTab(type) {
    const chart = charts[type];
    if (!chart.view._rendered) {
      currentRequest = renderChart(type, chart);
    }
  }

  // Chart Renderers
  function renderChart(type, chart) {
    const queryConfig = {
      visitors: {
        collection: 'activations',
        interval: 'monthly'
      },
      browsers: {
        collection: 'activations',
        groupBy: 'device_model_name'
      },
      geography: {
        collection: 'visit',
        groupBy: 'visitor.geo.province'
      }
    };

    const project = type === 'geography' ? keenClient : geoClient;

    return project
      .query('count', {
        event_collection: queryConfig[type].collection,
        interval: queryConfig[type].interval || null,
        group_by: queryConfig[type].groupBy || null,
        timeframe: {
          start: '2014-01-01',
          end: '2014-12-01'
        }
      })
      .then(res => chart.data(res).render())
      .catch(err => chart.message(err.message));
  }

  // Helper to Create Chart Instance
  function createChart(selector, title, type) {
    return new KeenDataviz({
      container: selector,
      title,
      type
    });
  }

  // Knob Setup
  setupKnob('.users', 0, 500, '#00bbde', 'activations', 'user.id');
  setupKnob('.errors', 0, 100, '#fe6672', 'user_action', 'error_detected', true);

  function setupKnob(selector, min, max, color, collection, property, filterByError = false) {
    $(selector).knob({
      angleArc: 250,
      angleOffset: -125,
      readOnly: true,
      min,
      max,
      fgColor: color,
      height: 290,
      width: '95%'
    });

    const filters = filterByError ? [{
      property_name: property,
      operator: 'eq',
      property_value: true
    }] : [];

    geoClient
      .query('count_unique', {
        event_collection: collection,
        target_property: property,
        filters
      })
      .then(res => $(selector).val(res.result).trigger('change'))
      .catch(() => alert(`Error fetching data for ${collection}`));
  }

  // Sample Funnel
  new KeenDataviz({
    container: '#chart-05',
    type: 'bar',
    colors: ['#00cfbb'],
    labels: ['Purchased', 'Activated', 'First Session', 'Second Session', 'Invited']
  })
    .data({
      result: [3250, 3000, 2432, 1504, 321]
    })
    .render();
});
