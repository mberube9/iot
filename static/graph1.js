

$( document ).ready(function() {




  var c3ChartDefaults = $().c3ChartDefaults();
  var chart = c3.generate({
    axis: {
      x: {tick: {format: '%m-%d %H:%M',outer: false},type: 'timeseries'},
      y: {tick: {format: function(d) { return d + ""; },outer: false}}
    },
    bindto: '#chart1',
    color: c3ChartDefaults.getDefaultColors(),
    data: {
      xFormat: '%Y-%m-%d %H:%M:%S',
      columns: [

      ],
      x: 'x'
    },
    grid: {y: {show: true}},
    legend: {hide: false},
    point: {r: 0},
    size: {height: 800},
    padding: {top: 20, right: 80, left:80, bottom:20},
    line: {connectNull: false},
    zoom: {enabled: true},
    subchart: {show: true},

    regions: [
        {axis: 'x', end: '2017-01-30 09:41:19', class: 'regionXOFF'},
        {axis: 'x', start: '2017-01-30 12:58:30', end: '2017-01-31 04:56:22', class: 'regionXON'},
        {axis: 'x', start: '2017-01-31 10:21:40', class: 'regionXOFF'}
    ]
  });



  var devices = [];
  devices[0] = {};
  devices[0]['id'] = '29005c000a51353335323535';
  devices[0]['data'] = ['Basement'];
  devices[1] = {};
  devices[1]['id'] = '1a0043000f51353338363333';
  devices[1]['data'] = ['LivingRoom'];
  devices[2] = {};
  devices[2]['id'] = 'Lennox';
  devices[2]['data'] = ['Furnace'];
  devices[3] = {};
  devices[3]['id'] = 'accuweather_milford';
  devices[3]['data'] = ['Milford'];


  APItoChart('http://' + window.location.hostname + ':' + window.location.port + '/api/sensors/temperatures/',devices,chart);

});


function APItoChart(url,devices,chart){

  var chart_columns = [];
  var x_column = ['x'];
  var i=0;
  var j=0;
  var data_entry;

  $.getJSON(url, function(data) {

      for (i = 0; i < data.length; i++) {
         x_column.push(data[i].Time);

         for (j = 0; j < devices.length; j++) {

           data_entry = data[i][devices[j]['id']];
           if (data_entry) {} else {data_entry = null}
           devices[j]['data'].push(data_entry);
         }

      }

      // Adding data to chart_columns;
      chart_columns.push(convertTZ(x_column,'America/New_York'));
      for (j = 0; j < devices.length; j++) {
        chart_columns.push(devices[j]['data'])
      }

      chart.load({columns: chart_columns});
      //chart.load({columns: [['x','2017-01-29 20:44:14'],['data1','15']]});

  });
};



function convertTZ(timeseries,tz){
  var arrayLength = timeseries.length;
  var time;
  var converted_timeseries = ['x'];

  moment.tz.add(['America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0','America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0']);

  for (var i = 1; i < arrayLength; i++) {
      time = moment(timeseries[i]);
      converted_timeseries.push( time.tz(tz).format('YYYY-MM-DD HH:mm:ss') );
  }

  return converted_timeseries;
};
