$(function () {

  class GaugeChart {
    constructor(element, params) {
      this._element = element;
      this._initialValue = params.initialValue;
      this._startValue = params.startValue;
      this._higherValue = params.higherValue;
      this._title = params.title;
      this._subtitle = params.subtitle;
      this._customTicks = params.ticks;
    }

    _buildConfig() {
      let element = this._element;

      return {
        value: this._initialValue,
        valueIndicator: {
          color: '#fff' },

        geometry: {
          startAngle: 180,
          endAngle: 360 },

        scale: {
          startValue: this._startValue,
          endValue: this._higherValue,
          customTicks: this._customTicks, //[0, 250, 500, 780, 1050, 1300, 1560],
          tick: {
            length: 8 },

          label: {
            font: {
              color: '#87959f',
              size: 9,
              family: '"Open Sans", sans-serif' } } },



        title: {
          verticalAlignment: 'bottom',
          text: this._title,
          font: {
            family: '"Open Sans", sans-serif',
            color: '#fff',
            size: 10 },

          subtitle: {
            text: this._subtitle,
            font: {
              family: '"Open Sans", sans-serif',
              color: '#fff',
              weight: 700,
              size: 28 } } },



        onInitialized: function () {
          let currentGauge = $(element);
          let circle = currentGauge.find('.dxg-spindle-hole').clone();
          let border = currentGauge.find('.dxg-spindle-border').clone();

          currentGauge.find('.dxg-title text').first().attr('y', 48);
          currentGauge.find('.dxg-title text').last().attr('y', 28);
          currentGauge.find('.dxg-value-indicator').append(border, circle);
        } };


    }

    init() {
      $(this._element).dxCircularGauge(this._buildConfig());
    }}



    function InitializeGauge(minValue, maxValue) {

        var customTicks = [];
        var iterations = 5;
        var currentValue = minValue;

        while (currentValue <= maxValue) {
            customTicks.push(currentValue);
            currentValue += (maxValue - minValue) / iterations;
        }


        $('.gauge').each(function (index, item) {
            let params = {
                initialValue: (maxValue - minValue) / 2,
                higherValue: maxValue,
                startValue: minValue,
                title: `Gauge ${index + 1}`,
                subtitle: (maxValue - minValue) / 2,
                ticks: customTicks
            };

            let gauge = new GaugeChart(item, params);
            gauge.init();
        });

        wasInitialized = true;
    }

  var wasInitialized = false;

  //https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxCircularGauge/
  $(document).ready(function () {

    //$('#random').click(function () {

    //  $('.gauge').each(function (index, item) {
    //    let gauge = $(item).dxCircularGauge('instance');
    //    let randomNum = Math.round(Math.random() * 1560);
    //    let gaugeElement = $(gauge._$element[0]);

    //    gaugeElement.find('.dxg-title text').last().html(`${randomNum} ºC`);
    //    gauge.value(randomNum);
    //  });
    //});

      var ws = new WebSocket('ws://127.0.0.1:1111/WService');

      ws.onmessage = function (evt) {
          var received_msg = evt.data;
          var responseObj = JSON.parse(received_msg);

          $('.gauge').each(function (index, item) {            

              if (!wasInitialized) {
                  InitializeGauge(responseObj.MinValue, responseObj.MaxValue);
              }

              let gauge = $(item).dxCircularGauge('instance');            

              let randomNum = Math.round(responseObj.Value);
              let gaugeElement = $(gauge._$element[0]);

              gaugeElement.find('.dxg-title text').last().html(responseObj.Name);
              gaugeElement.find('.dxg-title text').first().html(responseObj.Value);

              gauge.value(randomNum);
          });
      };

  });

});