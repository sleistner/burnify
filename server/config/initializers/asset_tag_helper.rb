# ActionView::Helpers::AssetTagHelper::register_javascript_include_default 'mootools-core', 'mootools-more', 'jquery-1.2.6.min', 'jquery-ui-datepicker-1.5.1.min', 'chart'
ActionView::Helpers::AssetTagHelper::register_javascript_expansion :burnify => [
  'mootools-core',
  'mootools-more',
  'jquery-1.2.6.min',
  'facebox',
  'jquery-ui-datepicker-1.5.1.min',
#  'canvastext',
#  'charts',
  'application',
  'strftime',
  'statusbar',
  'projects',
  'bluff-burndown-chart',
  'replay'
]
ActionView::Helpers::AssetTagHelper::register_javascript_expansion :bluff => [
  'bluff/excanvas.js',
  'bluff/js-class.js',
  'bluff/bluff-src.js'
]
