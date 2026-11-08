/*globals Pebble*/
/*jshint node: true*/
'use strict';

// ---------------------------------------------------------------------------
// Clay – settings page
// ---------------------------------------------------------------------------
var Clay = require('@rebble/clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig, null, { autoHandleEvents: false });
var messageKeys = require('message_keys');

// The watch reads these as C strings; every other setting must be an integer.
var STRING_KEYS = ['KEY_TIMEZONESCODE', 'KEY_TIMEZONESBCODE'];

// Settings only used on the phone – never sent to the watch.
var PHONE_ONLY_KEYS = /^KEY_CRYPTO(FROM|TO|MARKET|MULTI)/;

function readSettings() {
    try {
        return JSON.parse(localStorage.getItem('clay-settings')) || {};
    } catch (e) {
        return {};
    }
}

function setting(key, fallback) {
    var value = readSettings()[key];
    return value === undefined || value === null ? fallback : value;
}

function defaultSettings(items, out) {
    out = out || {};
    items.forEach(function(item) {
        if (item.items) {
            defaultSettings(item.items, out);
        } else if (item.messageKey && item.defaultValue !== undefined) {
            out[item.messageKey] = item.defaultValue;
        }
    });
    return out;
}

function toWatchValue(key, value) {
    if (STRING_KEYS.indexOf(key) !== -1) {
        return String(value || '');
    }
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    if (typeof value === 'string') {
        var parsed = value.indexOf('0x') === 0 ? parseInt(value, 16) : parseInt(value, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
    return value;
}

function buildWatchDict(settings) {
    var isAplite = Pebble.getActiveWatchInfo &&
        Pebble.getActiveWatchInfo().platform === 'aplite';
    var dict = {};
    Object.keys(settings).forEach(function(key) {
        if (messageKeys[key] === undefined || PHONE_ONLY_KEYS.test(key)) {
            return;
        }
        if (isAplite && /WRIST|TAP|SLEEP|HEART|DEEP|ACTIVE|_CAL|STEPS|DIST|ALTHOURSBCOLOR|CRYPTO[BCD]COLOR/.test(key)) {
            return;
        }
        dict[key] = toWatchValue(key, settings[key]);
    });
    return dict;
}

function sendSettings(settings) {
    var dict = buildWatchDict(settings);
    console.log('Sending settings: ' + JSON.stringify(dict));
    Pebble.sendAppMessage(dict, function() {
        console.log('Settings sent OK');
        sendWeather();
        getCryptocurrencies();
    }, function(e) {
        console.log('Settings send failed: ' + JSON.stringify(e));
    });
}

Pebble.addEventListener('showConfiguration', function() {
    Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
    if (!e || !e.response) {
        return;
    }
    clay.getSettings(e.response);
    sendSettings(readSettings());
});

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
var latestWeather = null;

function numeric(prop) {
    return prop && prop.numericValue ? prop.numericValue : null;
}

function toUserTemp(prop, fallback) {
    var nv = numeric(prop);
    if (!nv) {
        return fallback;
    }
    var isFahrenheit = String(nv.unit || '').toLowerCase().indexOf('f') !== -1;
    var useCelsius = !!toWatchValue('KEY_USECELSIUS', setting('KEY_USECELSIUS', false));
    var value = nv.value;
    if (useCelsius && isFahrenheit) {
        value = (value - 32) * 5 / 9;
    } else if (!useCelsius && !isFahrenheit) {
        value = value * 9 / 5 + 32;
    }
    return Math.round(value);
}

function toUserSpeed(prop) {
    var nv = numeric(prop);
    if (!nv) {
        return 0;
    }
    var unit = String(nv.unit || '').toLowerCase();
    var ms = nv.value;
    if (unit === 'km/h' || unit === 'kph') {
        ms = nv.value / 3.6;
    } else if (unit === 'mph') {
        ms = nv.value / 2.237;
    } else if (unit === 'knots' || unit === 'kn') {
        ms = nv.value / 1.944;
    }
    var speedUnit = toWatchValue('KEY_SPEEDUNIT', setting('KEY_SPEEDUNIT', 0));
    if (speedUnit === 1) {
        return Math.round(ms * 3.6);
    }
    if (speedUnit === 2) {
        return Math.round(ms * 1.944);
    }
    return Math.round(ms * 2.237);
}

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

            latestWeather = here.properties;
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
    if (!latestWeather) {
        return;
    }
    var p = latestWeather;
    var temp = toUserTemp(p.temperature, 0);
    var condCode = p.condition_code && p.condition_code.shortText
        ? p.condition_code.shortText.text : 'unknown';
    var direction = numeric(p.wind_direction);
    var data = {
        KEY_TEMP:      temp,
        KEY_MAX:       toUserTemp(p.high, temp),
        KEY_MIN:       toUserTemp(p.low, temp),
        KEY_WEATHER:   PLUGIN_ICON_MAP[condCode] !== undefined ? PLUGIN_ICON_MAP[condCode] : 0,
        KEY_FEELS:     toUserTemp(p.feels_like, temp),
        KEY_SPEED:     toUserSpeed(p.wind_speed),
        KEY_DIRECTION: direction ? Math.round(direction.value) : 0,
        KEY_SUNRISE:   p.sunrise && p.sunrise.timestamp ? Math.round(p.sunrise.timestamp.value) : 0,
        KEY_SUNSET:    p.sunset && p.sunset.timestamp ? Math.round(p.sunset.timestamp.value) : 0
    };
    console.log('Sending weather: ' + JSON.stringify(data));
    Pebble.sendAppMessage(
        data,
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
        var settings = readSettings();

        function cs(key) {
            return settings[key] || '';
        }

        var pairs = ['', 'B', 'C', 'D'].map(function(suffix) {
            return {
                priceKey: 'KEY_CRYPTOPRICE' + suffix,
                from:   cs('KEY_CRYPTOFROM' + suffix),
                to:     cs('KEY_CRYPTOTO' + suffix),
                market: cs('KEY_CRYPTOMARKET' + suffix),
                multi:  !!cs('KEY_CRYPTOMULTI' + suffix)
            };
        });

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
    if (!localStorage.getItem('clay-settings')) {
        var defaults = defaultSettings(clayConfig);
        clay.setSettings(defaults);
        sendSettings(defaults);
    }
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
