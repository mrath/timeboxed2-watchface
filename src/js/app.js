/*globals Pebble*/
/*jshint node: true*/
'use strict';

// ---------------------------------------------------------------------------
// Clay – settings page (handles showConfiguration + webviewclosed events)
// ---------------------------------------------------------------------------
var Clay = require('@rebble/clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig);

// ---------------------------------------------------------------------------
// Weather icon mapping from Pebble plugin condition_code strings
// (matches the weather-icon font codepoints used by the existing C code)
// ---------------------------------------------------------------------------
var PLUGIN_ICON_MAP = {
    'sun':           1,
    'partly_cloudy': 3,
    'cloudy':        7,
    'light_rain':    8,
    'heavy_rain':    8,
    'light_snow':    9,
    'heavy_snow':    9,
    'rain_and_snow': 11,
    'unknown':       0
};

// ---------------------------------------------------------------------------
// Weather via the Pebble app's built-in weather plugin
// ---------------------------------------------------------------------------
var latestWeatherData = null;

function subscribeToWeather() {
    Pebble.subscribeToSource({
        category: 'weather',
        item: 'location',
        properties: [
            'temperature',
            'high',
            'low',
            'condition_code',
            'feels_like',
            'wind_speed',
            'wind_direction',
            'sunrise',
            'sunset'
        ],
        onData: function(update) {
            var here = update.instances[0];
            if (!here) {
                console.log('Weather plugin: no location instances');
                return;
            }

            var p = here.properties;

            // Temperature
            var tempVal = p.temperature && p.temperature.numericValue
                ? Math.round(p.temperature.numericValue.value) : 0;

            // High / Low
            var maxVal = p.high && p.high.numericValue
                ? Math.round(p.high.numericValue.value) : tempVal;
            var minVal = p.low && p.low.numericValue
                ? Math.round(p.low.numericValue.value) : tempVal;

            // Condition icon code
            var condCode = p.condition_code && p.condition_code.shortText
                ? p.condition_code.shortText.text : 'unknown';
            var condId = PLUGIN_ICON_MAP[condCode] !== undefined
                ? PLUGIN_ICON_MAP[condCode] : 0;

            // Feels-like (wind chill / apparent temp)
            var feelsVal = p.feels_like && p.feels_like.numericValue
                ? Math.round(p.feels_like.numericValue.value) : tempVal;

            // Wind speed – convert to the user's preferred unit (mph/kph/knots)
            var speedUnit = parseInt(clay.getSettings()['SPEEDUNIT'] || 0, 10);
            var windSpeed = 0;
            if (p.wind_speed && p.wind_speed.numericValue) {
                var ws = p.wind_speed.numericValue;
                // plugin sends m/s; convert
                var ms = ws.value;
                if (ws.unit === 'km/h') {
                    ms = ws.value / 3.6;
                } else if (ws.unit === 'mph') {
                    ms = ws.value / 2.237;
                } else if (ws.unit === 'knots') {
                    ms = ws.value / 1.944;
                }
                // m/s → target unit
                if (speedUnit === 0) {       // mph
                    windSpeed = Math.round(ms * 2.237);
                } else if (speedUnit === 1) { // kph
                    windSpeed = Math.round(ms * 3.6);
                } else {                      // knots
                    windSpeed = Math.round(ms * 1.944);
                }
            }

            // Wind direction (degrees)
            var windDir = p.wind_direction && p.wind_direction.numericValue
                ? Math.round(p.wind_direction.numericValue.value) : 0;

            // Sunrise / Sunset (unix timestamp seconds)
            var sunriseTs = p.sunrise && p.sunrise.timestamp
                ? Math.round(p.sunrise.timestamp.value) : 0;
            var sunsetTs  = p.sunset  && p.sunset.timestamp
                ? Math.round(p.sunset.timestamp.value)  : 0;

            latestWeatherData = {
                KEY_TEMP:      tempVal,
                KEY_MAX:       maxVal,
                KEY_MIN:       minVal,
                KEY_WEATHER:   condId,
                KEY_FEELS:     feelsVal,
                KEY_SPEED:     windSpeed,
                KEY_DIRECTION: windDir,
                KEY_SUNRISE:   sunriseTs,
                KEY_SUNSET:    sunsetTs
            };

            sendWeather();
        },
        onError: function(err) {
            console.log('Weather plugin error: ' + err.code + ' ' + err.message);
            if (err.code === 'PLUGIN_UNAVAILABLE' || err.code === 'PERMISSION_DENIED') {
                console.log('Weather unavailable – user must enable Plugins in Pebble app settings.');
            }
        }
    });
}

function sendWeather() {
    if (!latestWeatherData) {
        return;
    }
    console.log('Sending weather: ' + JSON.stringify(latestWeatherData));
    Pebble.sendAppMessage(
        latestWeatherData,
        function() { console.log('Weather sent OK'); },
        function(e) { console.log('Weather send failed: ' + JSON.stringify(e)); }
    );
}

// ---------------------------------------------------------------------------
// Crypto prices via CryptoCompare
// ---------------------------------------------------------------------------
var formatNumber = function(number) {
    var numberStr = '' + number;
    var maxLength = Math.min(numberStr.length, 7);
    var dot = numberStr.indexOf('.');
    if (dot !== -1) {
        var beforeDot = Math.min(maxLength, dot);
        var afterDot = Math.max(0, maxLength - beforeDot);
        var num = numberStr.slice(dot - beforeDot, beforeDot + afterDot);
        if (num[num.length - 1] === '.') {
            return num.slice(0, num.length - 1);
        }
        return num;
    }
    return numberStr.slice(0, maxLength);
};

var xhrRequest = function(url, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        callback(this.responseText);
    };
    try {
        xhr.open(type, url);
        xhr.send();
    } catch (ex) {
        console.log('XHR error: ' + ex);
        sendError();
    }
};

var sendError = function() {
    Pebble.sendAppMessage(
        { KEY_ERROR: true },
        function() { console.log('Error state sent OK'); },
        function() { console.log('Error state send failed'); }
    );
};

var getCryptocurrencies = function() {
    try {
        var settings = clay.getSettings();

        // Helper: read a Clay setting, fall back to empty
        function cs(key) {
            return settings[key] || '';
        }

        var pairs = [
            {
                priceKey: 'KEY_CRYPTOPRICE',
                from: cs('CRYPTOFROM'),
                to:   cs('CRYPTOTO'),
                market: cs('CRYPTOMARKET'),
                multi: !!cs('CRYPTOMULTI')
            },
            {
                priceKey: 'KEY_CRYPTOPRICEB',
                from: cs('CRYPTOFROMB'),
                to:   cs('CRYPTOTOB'),
                market: cs('CRYPTOMARKETB'),
                multi: !!cs('CRYPTOMULTIB')
            },
            {
                priceKey: 'KEY_CRYPTOPRICEC',
                from: cs('CRYPTOFROMC'),
                to:   cs('CRYPTOTOC'),
                market: cs('CRYPTOMARKETC'),
                multi: !!cs('CRYPTOMULTIC')
            },
            {
                priceKey: 'KEY_CRYPTOPRICED',
                from: cs('CRYPTOFROMD'),
                to:   cs('CRYPTOTOD'),
                market: cs('CRYPTOMARKETD'),
                multi: !!cs('CRYPTOMULTID')
            }
        ];

        var pending = {};
        var results = {};

        pairs.forEach(function(pair) {
            if (pair.from && pair.from !== 'None' &&
                pair.to   && pair.to   !== 'None' &&
                pair.market && pair.market !== 'None') {
                pending[pair.priceKey] = pair;
                results[pair.priceKey] = null;
            }
        });

        if (Object.keys(pending).length === 0) {
            console.log('No crypto pairs configured');
            return;
        }

        console.log('Fetching crypto: ' + JSON.stringify(Object.keys(pending)));

        var retries = 0;
        var interval = setInterval(function() {
            var allDone = Object.keys(results).every(function(k) {
                return results[k] !== null;
            });

            if (allDone) {
                clearInterval(interval);
                Pebble.sendAppMessage(
                    results,
                    function() { console.log('Crypto sent OK'); },
                    function() { console.log('Crypto send failed'); }
                );
            } else if (retries > 20) {
                clearInterval(interval);
                console.log('Crypto timeout');
                sendError();
            } else {
                retries += 1;
            }
        }, 200);

        Object.keys(pending).forEach(function(key) {
            var p = pending[key];
            var url = 'https://min-api.cryptocompare.com/data/price?fsym=' +
                p.from + '&tsyms=' + p.to + '&e=' + p.market;
            xhrRequest(url, 'GET', function(responseText) {
                try {
                    var resp = JSON.parse(responseText);
                    results[key] = formatNumber(
                        p.multi
                            ? Math.round(parseFloat(resp[p.to]) * 100000000)
                            : resp[p.to]
                    );
                } catch (ex) {
                    console.log('Crypto parse error for ' + key + ': ' + ex);
                    results[key] = '?';
                }
            });
        });
    } catch (ex) {
        console.log('getCryptocurrencies error: ' + ex);
    }
};

// ---------------------------------------------------------------------------
// Pebble event listeners
// ---------------------------------------------------------------------------
Pebble.addEventListener('ready', function() {
    console.log('Timeboxed 2 PKJS ready');
    subscribeToWeather();
});

Pebble.addEventListener('appmessage', function(e) {
    if (e.payload.KEY_REQUESTWEATHER) {
        console.log('Watch requested weather refresh');
        // Re-send latest cached data; plugin subscription handles live updates
        sendWeather();
    } else if (e.payload.KEY_REQUESTCRYPTO) {
        console.log('Watch requested crypto refresh');
        getCryptocurrencies();
    }
});
