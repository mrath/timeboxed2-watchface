/*globals Pebble*/
/*jshint node: true*/
'use strict';

// ---------------------------------------------------------------------------
// Clay – settings page
// ---------------------------------------------------------------------------
var Clay = require('@rebble/clay');
var clayConfig = require('./config');
var SAME_AS_DEFAULT = clayConfig.SAME_AS_DEFAULT;
var clay = new Clay(clayConfig, null, { autoHandleEvents: false });
clay.registerComponent(require('./tabs'));
var messageKeys = require('message_keys');

// The watch reads these as C strings; every other setting must be an integer.
var STRING_KEYS = ['KEY_TIMEZONESCODE', 'KEY_TIMEZONESBCODE'];

// Settings only used on the phone – never sent to the watch.
var PHONE_ONLY_KEYS = /^KEY_(TICKER|CRYPTO(FROM|TO|MARKET|MULTI))/;

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
        var value = toWatchValue(key, settings[key]);
        var alternate = /^KEY_(SLEEP|TAP|WRIST)SLOT([A-F])$/.exec(key);
        if (alternate && value === SAME_AS_DEFAULT) {
            var normalKey = 'KEY_SLOT' + alternate[2];
            value = settings[normalKey] === undefined ? 0 : toWatchValue(normalKey, settings[normalKey]);
        }
        // The weather plugin has no wind, so a saved Wind slot is cleared.
        if (/SLOT[A-F]$/.test(key) && value === 8) {
            value = 0;
        }
        dict[key] = value;
    });
    return dict;
}

function sendSettings(settings) {
    var dict = buildWatchDict(settings);
    console.log('Sending settings: ' + JSON.stringify(dict));
    Pebble.sendAppMessage(dict, function() {
        console.log('Settings sent OK');
        // Quotes are not fetched here: the watch requests them itself after
        // applying settings, and only when a ticker module is shown.
        sendWeather();
    }, function(e) {
        console.log('Settings send failed: ' + JSON.stringify(e));
    });
}

Pebble.addEventListener('showConfiguration', function() {
    migrateTickerSettings();
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

var NIGHT_ICON_MAP = {
    1: 20,
    3: 22
};

// ---------------------------------------------------------------------------
// Sunrise/sunset from the phone's position (the weather plugin has neither)
// ---------------------------------------------------------------------------
var sunTimes = null;

// Sunrise equation, see https://en.wikipedia.org/wiki/Sunrise_equation.
// Returns unix seconds, or null during polar day/night.
function computeSunTimes(lat, lon, date) {
    var rad = Math.PI / 180;
    var julianDate = date.getTime() / 86400000 + 2440587.5;
    // Solar noon nearest to now, i.e. today's in local solar time.
    var n = Math.round(julianDate - 2451545.0 + lon / 360);
    var meanSolarTime = n - lon / 360;
    var anomaly = (357.5291 + 0.98560028 * meanSolarTime) % 360;
    var center = 1.9148 * Math.sin(anomaly * rad) +
        0.0200 * Math.sin(2 * anomaly * rad) +
        0.0003 * Math.sin(3 * anomaly * rad);
    var longitude = (anomaly + center + 180 + 102.9372) % 360;
    var transit = 2451545.0 + meanSolarTime +
        0.0053 * Math.sin(anomaly * rad) - 0.0069 * Math.sin(2 * longitude * rad);
    var sinDeclination = Math.sin(longitude * rad) * Math.sin(23.4397 * rad);
    var cosDeclination = Math.cos(Math.asin(sinDeclination));
    var cosHourAngle = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * sinDeclination) /
        (Math.cos(lat * rad) * cosDeclination);
    if (cosHourAngle < -1 || cosHourAngle > 1) {
        return null;
    }
    var hourAngle = Math.acos(cosHourAngle) / rad;
    function toUnix(julian) {
        return Math.round((julian - 2440587.5) * 86400);
    }
    return {
        sunrise: toUnix(transit - hourAngle / 360),
        sunset: toUnix(transit + hourAngle / 360)
    };
}

function updateSunTimes(callback) {
    if (!navigator.geolocation) {
        callback();
        return;
    }
    navigator.geolocation.getCurrentPosition(function(pos) {
        sunTimes = computeSunTimes(pos.coords.latitude, pos.coords.longitude, new Date());
        console.log('Sun times: ' + JSON.stringify(sunTimes));
        callback();
    }, function(err) {
        console.log('Location error: ' + err.message);
        callback();
    }, { timeout: 15000, maximumAge: 3600000 });
}

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

// The watch converts from mph to the selected unit itself.
function toMph(prop) {
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
            'feels_like'
        ],
        onData: function(update) {
            var here = update.instances[0];
            if (!here) {
                console.log('Weather plugin: no location instances');
                return;
            }

            latestWeather = here.properties;
            updateSunTimes(sendWeather);
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
    var condText = p.condition_code &&
        (p.condition_code.longText || p.condition_code.shortText);
    var condCode = condText ? condText.text : 'unknown';
    var icon = PLUGIN_ICON_MAP[condCode] !== undefined ? PLUGIN_ICON_MAP[condCode] : 0;
    var now = Date.now() / 1000;
    if (sunTimes && (now < sunTimes.sunrise || now > sunTimes.sunset) && NIGHT_ICON_MAP[icon]) {
        icon = NIGHT_ICON_MAP[icon];
    }
    var direction = numeric(p.wind_direction);
    var data = {
        KEY_TEMP:      temp,
        KEY_MAX:       toUserTemp(p.high, temp),
        KEY_MIN:       toUserTemp(p.low, temp),
        KEY_WEATHER:   icon,
        KEY_FEELS:     toUserTemp(p.feels_like, temp),
        KEY_SPEED:     toMph(p.wind_speed),
        KEY_DIRECTION: direction ? Math.round(direction.value) : 0,
        KEY_SUNRISE:   sunTimes ? sunTimes.sunrise : 0,
        KEY_SUNSET:    sunTimes ? sunTimes.sunset : 0
    };
    console.log('Sending weather: ' + JSON.stringify(data));
    Pebble.sendAppMessage(
        data,
        function() { console.log('Weather sent OK'); },
        function(e) { console.log('Weather send failed: ' + JSON.stringify(e)); }
    );
}

// ---------------------------------------------------------------------------
// Stock, ETF, index, FX and crypto quotes via Yahoo Finance's chart endpoint,
// with Coinbase spot prices as a fallback for crypto pairs such as BTC-USD.
// ---------------------------------------------------------------------------
var TICKER_SUFFIXES = ['', 'B', 'C', 'D'];
// The watch copies each quote into an 8-byte buffer.
var MAX_QUOTE_LENGTH = 7;
var QUOTE_TIMEOUT_MS = 10000;
// Yahoo answers 429 to requests without a user agent and to bursts from one IP.
var QUOTE_USER_AGENT = 'Mozilla/5.0';
var YAHOO_HOSTS = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];
var STOCK_TYPES = ['EQUITY', 'ETF', 'INDEX', 'MUTUALFUND', 'FUTURE'];

// Turns the old CryptoCompare from/to pairs into Yahoo symbols (BTC + USD -> BTC-USD).
// Clay drops unknown keys on the next save, so this must run before the page opens.
function migrateTickerSettings() {
    var settings = readSettings();
    var changed = false;
    TICKER_SUFFIXES.forEach(function(suffix) {
        var from = settings['KEY_CRYPTOFROM' + suffix];
        var to = settings['KEY_CRYPTOTO' + suffix];
        if (settings['KEY_TICKER' + suffix] === undefined && from !== undefined) {
            var valid = from && to && from !== 'None' && to !== 'None';
            settings['KEY_TICKER' + suffix] = valid ? (from + '-' + to).toUpperCase().replace(/\s/g, '') : '';
            changed = true;
        }
        ['FROM', 'TO', 'MARKET', 'MULTI'].forEach(function(name) {
            if (settings['KEY_CRYPTO' + name + suffix] !== undefined) {
                delete settings['KEY_CRYPTO' + name + suffix];
                changed = true;
            }
        });
    });
    if (changed) {
        console.log('Migrated crypto settings to ticker symbols');
        localStorage.setItem('clay-settings', JSON.stringify(settings));
    }
}

// decimals < 0 uses as many as fit (max 4, or 5 below 1).
// Values too wide for the watch are shortened with k/M/B.
function formatPrice(value, decimals) {
    if (typeof value !== 'number' || !isFinite(value)) {
        return '?';
    }
    var sign = value < 0 ? '-' : '';
    var abs = Math.abs(value);
    if (abs > 0 && abs < 0.001 && decimals < 0) {
        var digits = 2;
        var exponential;
        do {
            exponential = sign + abs.toExponential(digits);
            digits -= 1;
        } while (exponential.length > MAX_QUOTE_LENGTH && digits >= 0);
        return exponential;
    }
    var units = ['', 'k', 'M', 'B'];
    for (var u = 0; u < units.length; u++) {
        var room = MAX_QUOTE_LENGTH - sign.length - units[u].length;
        var intLength = String(Math.round(abs)).length;
        if (intLength <= room) {
            var fit = Math.max(0, room - intLength - 1);
            var auto = abs < 1 ? 5 : 4;
            var text = abs.toFixed(Math.min(decimals < 0 ? auto : decimals, fit));
            return sign + text + units[u];
        }
        abs /= 1000;
    }
    return '?';
}

function formatChange(percent, decimals) {
    if (typeof percent !== 'number' || !isFinite(percent)) {
        return '?';
    }
    var abs = Math.abs(percent);
    var places = decimals >= 0 ? decimals : (abs >= 100 ? 0 : abs >= 10 ? 1 : 2);
    var text;
    do {
        text = (percent < 0 ? '-' : '+') + abs.toFixed(places) + '%';
        places -= 1;
    } while (text.length > MAX_QUOTE_LENGTH && places >= 0);
    return text.length > MAX_QUOTE_LENGTH ? '?' : text;
}

function formatQuote(quote, show, decimals) {
    if (show === 1) {
        return formatChange(quote.changePercent, decimals);
    }
    if (decimals < 0 && quote.stockLike && Math.abs(quote.price) >= 1) {
        decimals = 2;
    }
    return formatPrice(quote.price, decimals);
}

function getJson(url, callback) {
    var finished = false;
    function finish(error, data) {
        if (!finished) {
            finished = true;
            callback(error, data);
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status !== 200) {
            finish('HTTP ' + this.status);
            return;
        }
        try {
            finish(null, JSON.parse(this.responseText));
        } catch (ex) {
            finish('Invalid JSON');
        }
    };
    xhr.onerror = function() {
        finish('Network error');
    };
    setTimeout(function() {
        finish('Timeout');
    }, QUOTE_TIMEOUT_MS);
    try {
        xhr.open('GET', url);
        try {
            xhr.setRequestHeader('User-Agent', QUOTE_USER_AGENT);
        } catch (ignored) {
            // Browser-based runtimes refuse to override the user agent.
        }
        xhr.send();
    } catch (ex) {
        finish('XHR error: ' + ex);
    }
}

function fetchYahooQuote(symbol, callback, hostIndex) {
    hostIndex = hostIndex || 0;
    var url = 'https://' + YAHOO_HOSTS[hostIndex] + '/v8/finance/chart/' +
        encodeURIComponent(symbol) + '?range=1d&interval=1d';
    getJson(url, function(error, data) {
        var meta = !error && data && data.chart && data.chart.result && data.chart.result[0] &&
            data.chart.result[0].meta;
        if (!meta || typeof meta.regularMarketPrice !== 'number') {
            if (error && hostIndex + 1 < YAHOO_HOSTS.length) {
                fetchYahooQuote(symbol, callback, hostIndex + 1);
            } else {
                callback(error || 'No data');
            }
            return;
        }
        var price = meta.regularMarketPrice;
        var previous = meta.chartPreviousClose || meta.previousClose;
        var change = typeof meta.regularMarketChangePercent === 'number' ? meta.regularMarketChangePercent :
            previous ? (price - previous) / previous * 100 : null;
        callback(null, {
            price: price,
            changePercent: change,
            stockLike: STOCK_TYPES.indexOf(meta.instrumentType) !== -1
        });
    });
}

function fetchCoinbaseQuote(symbol, callback) {
    getJson('https://api.coinbase.com/v2/prices/' + encodeURIComponent(symbol) + '/spot', function(error, data) {
        var price = !error && data && data.data ? parseFloat(data.data.amount) : NaN;
        if (isNaN(price)) {
            callback(error || 'No data');
            return;
        }
        callback(null, { price: price, changePercent: null, stockLike: false });
    });
}

function fetchQuote(symbol, callback) {
    fetchYahooQuote(symbol, function(error, quote) {
        if (!error) {
            callback(null, quote);
            return;
        }
        console.log('Yahoo quote failed for ' + symbol + ': ' + error);
        if (!/^[A-Z0-9]+-[A-Z]{3,4}$/.test(symbol)) {
            callback(error);
            return;
        }
        fetchCoinbaseQuote(symbol, function(fallbackError, fallbackQuote) {
            if (fallbackError) {
                console.log('Coinbase quote failed for ' + symbol + ': ' + fallbackError);
            }
            callback(fallbackError, fallbackQuote);
        });
    });
}

var sendError = function() {
    Pebble.sendAppMessage(
        { KEY_ERROR: true },
        function() { console.log('Error state sent OK'); },
        function() { console.log('Error state send failed'); }
    );
};

var quotesInFlight = false;

function getQuotes() {
    if (quotesInFlight) {
        console.log('Quote fetch already in progress');
        return;
    }
    var settings = readSettings();
    var tickers = [];
    TICKER_SUFFIXES.forEach(function(suffix) {
        var symbol = String(settings['KEY_TICKER' + suffix] || '').trim().toUpperCase();
        if (symbol) {
            var decimals = parseInt(settings['KEY_TICKERDECIMALS' + suffix], 10);
            tickers.push({
                priceKey: 'KEY_CRYPTOPRICE' + suffix,
                symbol: symbol,
                show: parseInt(settings['KEY_TICKERSHOW' + suffix], 10) || 0,
                decimals: isNaN(decimals) ? -1 : decimals
            });
        }
    });

    if (tickers.length === 0) {
        console.log('No ticker symbols configured');
        return;
    }

    console.log('Fetching quotes: ' + tickers.map(function(t) { return t.symbol; }).join(', '));

    var results = {};
    var pending = tickers.length;
    var failures = 0;
    quotesInFlight = true;
    tickers.forEach(function(ticker) {
        fetchQuote(ticker.symbol, function(error, quote) {
            if (error) {
                failures += 1;
                results[ticker.priceKey] = '?';
            } else {
                results[ticker.priceKey] = formatQuote(quote, ticker.show, ticker.decimals);
            }
            pending -= 1;
            if (pending > 0) {
                return;
            }
            quotesInFlight = false;
            if (failures === tickers.length) {
                sendError();
                return;
            }
            console.log('Sending quotes: ' + JSON.stringify(results));
            Pebble.sendAppMessage(
                results,
                function() { console.log('Quotes sent OK'); },
                function() { console.log('Quotes send failed'); }
            );
        });
    });
}

// ---------------------------------------------------------------------------
// Pebble event listeners
// ---------------------------------------------------------------------------
Pebble.addEventListener('ready', function() {
    console.log('Timeboxed 2 PKJS ready');
    migrateTickerSettings();
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
        console.log('Watch requested quote refresh');
        getQuotes();
    }
});
