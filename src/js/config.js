/*jshint node: true*/
'use strict';

// Widget module options (shared across all slot selects)
var MODULES = [
    { label: 'None',                value: 0  },
    { label: 'Weather icon',        value: 1  },
    { label: 'Forecast hi/lo',      value: 2  },
    { label: 'Steps',               value: 3  },
    { label: 'Distance',            value: 4  },
    { label: 'Calories',            value: 5  },
    { label: 'Sleep',               value: 6  },
    { label: 'Deep sleep',          value: 7  },
    { label: 'Feels like',          value: 9  },
    { label: 'Weather + Feels',     value: 10 },
    { label: 'Sunrise',             value: 11 },
    { label: 'Sunset',              value: 12 },
    { label: 'Active calories',     value: 13 },
    { label: 'Heart rate',          value: 14 },
    { label: 'Compass',             value: 15 },
    { label: 'Seconds',             value: 16 },
    { label: 'Battery',             value: 17 },
    { label: 'Timezone A',          value: 18 },
    { label: 'Timezone B',          value: 19 },
    { label: 'Ticker A',            value: 20 },
    { label: 'Ticker B',            value: 21 },
    { label: 'Ticker C',            value: 22 },
    { label: 'Ticker D',            value: 23 }
];

// Sleep, tap and shake slots. -1 is replaced with the Default slot's module
// before anything is sent to the watch, so 0 stays "None".
var SAME_AS_DEFAULT = -1;
var MODULES_WITH_INHERIT = [
    { label: 'Same as Default', value: SAME_AS_DEFAULT },
    { label: 'None',            value: 0 }
].concat(MODULES.slice(1));
var INHERIT_DEFAULTS = [SAME_AS_DEFAULT, SAME_AS_DEFAULT, SAME_AS_DEFAULT, SAME_AS_DEFAULT, SAME_AS_DEFAULT, SAME_AS_DEFAULT];

var SLOT_NAMES = {
    A: 'Slot A (top-left)',
    B: 'Slot B (top-right)',
    C: 'Slot C (bottom-left)',
    D: 'Slot D (bottom-right)',
    E: 'Slot E (above clock)',
    F: 'Slot F (below clock)'
};

function slotSelects(prefix, group, defaults) {
    return 'ABCDEF'.split('').map(function(slot, i) {
        return {
            type: 'select',
            messageKey: 'KEY_' + prefix + 'SLOT' + slot,
            label: SLOT_NAMES[slot],
            defaultValue: defaults[i],
            group: group,
            options: prefix ? MODULES_WITH_INHERIT : MODULES
        };
    });
}

function tickerItems(suffix) {
    var group = 'ticker-' + (suffix || 'A');
    return [
        {
            type: 'input',
            messageKey: 'KEY_TICKER' + suffix,
            label: 'Symbol',
            defaultValue: '',
            group: group,
            attributes: { placeholder: 'e.g. AAPL or BTC-USD', autocapitalize: 'characters', autocorrect: 'off', spellcheck: false }
        },
        {
            type: 'select',
            messageKey: 'KEY_TICKERSHOW' + suffix,
            label: 'Show',
            defaultValue: 0,
            group: group,
            options: [
                { label: 'Price',            value: 0 },
                { label: 'Daily change (%)', value: 1 }
            ]
        },
        {
            type: 'select',
            messageKey: 'KEY_TICKERDECIMALS' + suffix,
            label: 'Decimals',
            defaultValue: -1,
            group: group,
            options: [
                { label: 'Auto', value: -1 },
                { label: '0',    value: 0  },
                { label: '1',    value: 1  },
                { label: '2',    value: 2  },
                { label: '3',    value: 3  },
                { label: '4',    value: 4  }
            ]
        }
    ];
}

var config = [
    {
        type: 'submit',
        defaultValue: 'Save Settings'
    },
    // -----------------------------------------------------------------------
    // Font & Layout
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Font & Layout' },
            {
                type: 'select',
                messageKey: 'KEY_FONTTYPE',
                label: 'Font',
                defaultValue: 6,
                options: [
                    { label: 'Blocko',          value: 0 },
                    { label: 'Blocko Big',       value: 1 },
                    { label: 'Archivo Narrow',   value: 3 },
                    { label: 'OSP-DIN',          value: 4 },
                    { label: 'Prototype',        value: 5 },
                    { label: 'LECO',             value: 6 },
                    { label: 'Konstruct',        value: 7 }
                ]
            },
            {
                type: 'select',
                messageKey: 'KEY_TEXTALIGN',
                label: 'Text Alignment',
                defaultValue: 2,
                options: [
                    { label: 'Left',   value: 0 },
                    { label: 'Center', value: 1 },
                    { label: 'Right',  value: 2 }
                ]
            },
            {
                type: 'toggle',
                messageKey: 'KEY_QUICKVIEW',
                label: 'Enable Quick View mode',
                defaultValue: true
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Date & Time
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Date & Time' },
            {
                type: 'select',
                messageKey: 'KEY_DATEFORMAT',
                label: 'Date Format',
                defaultValue: 0,
                options: [
                    { label: 'Weekday + Month + Day',    value: 0 },
                    { label: 'Weekday + Day + Month',    value: 1 },
                    { label: 'Weekday + Day',            value: 2 },
                    { label: 'Day + Month',              value: 3 },
                    { label: 'Month + Day',              value: 4 },
                    { label: 'Day + Short Month',        value: 5 },
                    { label: 'Short Month + Day',        value: 6 },
                    { label: 'Weekday Day Short Month',  value: 7 },
                    { label: 'Weekday Short Month Day',  value: 8 },
                    { label: 'ISO (YYYY-MM-DD)',          value: 9 },
                    { label: 'Wday Num Day Short Month', value: 10 },
                    { label: 'Wday Num Short Month Day', value: 11 }
                ]
            },
            {
                type: 'select',
                messageKey: 'KEY_DATESEPARATOR',
                label: 'Date Separator',
                defaultValue: 1,
                options: [
                    { label: 'Space ( )', value: 0 },
                    { label: 'Dot (.)',   value: 1 },
                    { label: 'Slash (/)', value: 2 },
                    { label: 'Dash (-)',  value: 3 }
                ]
            },
            {
                type: 'toggle',
                messageKey: 'KEY_LEADINGZERO',
                label: 'Hours with leading zero',
                defaultValue: true
            },
            {
                type: 'select',
                messageKey: 'KEY_LOCALE',
                label: 'Language',
                defaultValue: 0,
                options: [
                    { label: 'English',    value: 0  },
                    { label: 'Portuguese', value: 1  },
                    { label: 'French',     value: 2  },
                    { label: 'German',     value: 3  },
                    { label: 'Spanish',    value: 4  },
                    { label: 'Italian',    value: 5  },
                    { label: 'Dutch',      value: 6  },
                    { label: 'Danish',     value: 7  },
                    { label: 'Turkish',    value: 8  },
                    { label: 'Czech',      value: 9  },
                    { label: 'Polish',     value: 10 },
                    { label: 'Swedish',    value: 11 },
                    { label: 'Finnish',    value: 12 },
                    { label: 'Slovak',     value: 13 }
                ]
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Timezone A
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Timezone A' },
            {
                type: 'input',
                messageKey: 'KEY_TIMEZONESCODE',
                label: 'Label (e.g. UTC)',
                defaultValue: '',
                attributes: { maxlength: 5 }
            },
            {
                type: 'select',
                messageKey: 'KEY_TIMEZONES',
                label: 'Hour offset',
                defaultValue: 0,
                options: (function() {
                    var opts = [];
                    for (var h = -12; h <= 14; h++) {
                        opts.push({ label: (h >= 0 ? '+' : '') + h + 'h', value: h });
                    }
                    return opts;
                }())
            },
            {
                type: 'select',
                messageKey: 'KEY_TIMEZONESMINUTES',
                label: 'Minute offset',
                defaultValue: 0,
                options: [
                    { label: '0 min',  value: 0  },
                    { label: '15 min', value: 15 },
                    { label: '30 min', value: 30 },
                    { label: '45 min', value: 45 }
                ]
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Timezone B
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Timezone B' },
            {
                type: 'input',
                messageKey: 'KEY_TIMEZONESBCODE',
                label: 'Label (e.g. EST)',
                defaultValue: '',
                attributes: { maxlength: 5 }
            },
            {
                type: 'select',
                messageKey: 'KEY_TIMEZONESB',
                label: 'Hour offset',
                defaultValue: 0,
                options: (function() {
                    var opts = [];
                    for (var h = -12; h <= 14; h++) {
                        opts.push({ label: (h >= 0 ? '+' : '') + h + 'h', value: h });
                    }
                    return opts;
                }())
            },
            {
                type: 'select',
                messageKey: 'KEY_TIMEZONESBMINUTES',
                label: 'Minute offset',
                defaultValue: 0,
                options: [
                    { label: '0 min',  value: 0  },
                    { label: '15 min', value: 15 },
                    { label: '30 min', value: 30 },
                    { label: '45 min', value: 45 }
                ]
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Weather (powered by Pebble app weather plugin – no API key needed)
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Weather' },
            {
                type: 'text',
                defaultValue: 'Weather is provided by the Pebble app\'s built-in weather plugin. Enable it in Pebble app: Settings → Plugins → "Plugins / permissions preview".'
            },
            {
                type: 'toggle',
                messageKey: 'KEY_USECELSIUS',
                label: 'Show temperature in Celsius',
                defaultValue: false
            },
            {
                type: 'select',
                messageKey: 'KEY_WEATHERTIME',
                label: 'Weather refresh (minutes)',
                defaultValue: 30,
                options: [
                    { label: '15 min', value: 15 },
                    { label: '30 min', value: 30 },
                    { label: '60 min', value: 60 }
                ]
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Widget Slots
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Widget Slots' },
            { type: 'text', defaultValue: 'Slots A-D form a 2×2 grid around the clock. E is above, F is below.' },
            {
                type: 'tabs',
                options: [
                    { label: 'Default', group: 'slots-normal' },
                    { label: 'Sleep',  group: 'slots-sleep' },
                    { label: 'Tap',    group: 'slots-tap' },
                    { label: 'Shake',  group: 'slots-wrist' }
                ]
            }
        ]
        .concat(slotSelects('', 'slots-normal', [1, 2, 3, 4, 18, 17]))
        .concat([
            {
                type: 'toggle',
                messageKey: 'KEY_SHOWSLEEP',
                label: 'Enable after wake up mode',
                description: 'Shows these slots from when you\'re asleep until half an hour after you wake up. Requires Pebble Health.',
                defaultValue: false,
                group: 'slots-sleep'
            }
        ])
        .concat(slotSelects('SLEEP', 'slots-sleep', INHERIT_DEFAULTS))
        .concat([
            {
                type: 'toggle',
                messageKey: 'KEY_SHOWTAP',
                label: 'Enable tap mode',
                description: 'Tap the watch screen to show these slots for the time selected below. Light taps might not register.',
                defaultValue: false,
                group: 'slots-tap'
            },
            {
                type: 'select',
                messageKey: 'KEY_TAPTIME',
                label: 'Tap/shake mode duration',
                defaultValue: 7,
                group: 'slots-tap',
                options: [
                    { label: '5 s',  value: 5  },
                    { label: '7 s',  value: 7  },
                    { label: '10 s', value: 10 }
                ]
            }
        ])
        .concat(slotSelects('TAP', 'slots-tap', INHERIT_DEFAULTS))
        .concat([
            {
                type: 'toggle',
                messageKey: 'KEY_SHOWWRIST',
                label: 'Enable wrist shake mode',
                description: 'Shake your wrist to show these slots for the tap/shake duration (set in the Tap tab).',
                defaultValue: false,
                group: 'slots-wrist'
            }
        ])
        .concat(slotSelects('WRIST', 'slots-wrist', INHERIT_DEFAULTS))
    },
    // -----------------------------------------------------------------------
    // Notifications & Alerts
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Notifications & Alerts' },
            {
                type: 'toggle',
                messageKey: 'KEY_BLUETOOTHDISCONNECT',
                label: 'Vibrate on Bluetooth disconnect',
                defaultValue: true
            },
            {
                type: 'toggle',
                messageKey: 'KEY_UPDATE',
                label: 'Check for updates',
                defaultValue: true
            },
            {
                type: 'toggle',
                messageKey: 'KEY_MUTEONQUIET',
                label: 'Mute vibration in quiet time',
                defaultValue: false
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Health
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Health' },
            {
                type: 'toggle',
                messageKey: 'KEY_USEKM',
                label: 'Use kilometers for distance',
                defaultValue: false
            },
            {
                type: 'toggle',
                messageKey: 'KEY_USECAL',
                label: 'Show calories (not kcal)',
                defaultValue: false
            },
            {
                type: 'input',
                messageKey: 'KEY_HEARTLOW',
                label: 'Heart rate low threshold',
                defaultValue: '0',
                attributes: { type: 'number', min: 0, max: 300 }
            },
            {
                type: 'input',
                messageKey: 'KEY_HEARTHIGH',
                label: 'Heart rate high threshold',
                defaultValue: '0',
                attributes: { type: 'number', min: 0, max: 300 }
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Colors
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Colors' },
            {
                type: 'toggle',
                messageKey: 'KEY_ENABLEADVANCED',
                label: 'Advanced colors',
                description: 'When off, every element uses the Hours color.',
                defaultValue: false
            },
            { type: 'color', messageKey: 'KEY_BGCOLOR',           label: 'Background',         defaultValue: '0x000000' },
            { type: 'color', messageKey: 'KEY_HOURSCOLOR',        label: 'Hours',               defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_ALTHOURSCOLOR',     label: 'Alt Hours (Tz A)',     defaultValue: '0xAAAAAA' },
            { type: 'color', messageKey: 'KEY_ALTHOURSBCOLOR',    label: 'Alt Hours (Tz B)',     defaultValue: '0xAAAAAA' },
            { type: 'color', messageKey: 'KEY_DATECOLOR',         label: 'Date',                defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_BLUETOOTHCOLOR',    label: 'Bluetooth icon',      defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_UPDATECOLOR',       label: 'Update icon',         defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_BATTERYCOLOR',      label: 'Battery',             defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_BATTERYLOWCOLOR',   label: 'Battery low',         defaultValue: '0xFF0000' },
            { type: 'color', messageKey: 'KEY_TEMPCOLOR',         label: 'Temperature',         defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_WEATHERCOLOR',      label: 'Weather icon',        defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_MINCOLOR',          label: 'Min temperature',     defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_MAXCOLOR',          label: 'Max temperature',     defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_COMPASSCOLOR',      label: 'Compass',             defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_SUNRISECOLOR',      label: 'Sunrise',             defaultValue: '0xFFFF00' },
            { type: 'color', messageKey: 'KEY_SUNSETCOLOR',       label: 'Sunset',              defaultValue: '0xFF8000' },
            { type: 'color', messageKey: 'KEY_SECONDSCOLOR',      label: 'Seconds',             defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CRYPTOCOLOR',       label: 'Ticker A',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CRYPTOBCOLOR',      label: 'Ticker B',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CRYPTOCCOLOR',      label: 'Ticker C',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CRYPTODCOLOR',      label: 'Ticker D',            defaultValue: '0xFFFFFF' }
        ]
    },
    // -----------------------------------------------------------------------
    // Health Colors
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Health Colors' },
            { type: 'color', messageKey: 'KEY_STEPSCOLOR',       label: 'Steps',              defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_STEPSBEHINDCOLOR', label: 'Steps (behind goal)', defaultValue: '0x777777' },
            { type: 'color', messageKey: 'KEY_DISTCOLOR',        label: 'Distance',           defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_DISTBEHINDCOLOR',  label: 'Distance (behind)',   defaultValue: '0x777777' },
            { type: 'color', messageKey: 'KEY_CALCOLOR',         label: 'Calories',           defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CALBEHINDCOLOR',   label: 'Calories (behind)',   defaultValue: '0x777777' },
            { type: 'color', messageKey: 'KEY_SLEEPCOLOR',       label: 'Sleep',              defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_SLEEPBEHINDCOLOR', label: 'Sleep (behind goal)', defaultValue: '0x777777' },
            { type: 'color', messageKey: 'KEY_DEEPCOLOR',        label: 'Deep sleep',         defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_DEEPBEHINDCOLOR',  label: 'Deep sleep (behind)', defaultValue: '0x777777' },
            { type: 'color', messageKey: 'KEY_ACTIVECOLOR',      label: 'Active calories',    defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_ACTIVEBEHINDCOLOR',label: 'Active (behind)',     defaultValue: '0x777777' },
            { type: 'color', messageKey: 'KEY_HEARTCOLOR',       label: 'Heart rate',         defaultValue: '0xFF0000' },
            { type: 'color', messageKey: 'KEY_HEARTCOLOROFF',    label: 'Heart rate (resting)',defaultValue: '0xAA0000' }
        ]
    },
    // -----------------------------------------------------------------------
    // Stocks & Crypto
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Stocks & Crypto' },
            {
                type: 'text',
                defaultValue: 'Add a Ticker A-D module to a widget slot to show it. Symbols use Yahoo Finance format, for example ' +
                    'AAPL, NOVO-B.CO (Copenhagen), SPY (ETF), ^GSPC (S&amp;P 500), BTC-USD, ETH-EUR or EURUSD=X (FX). ' +
                    'Look up symbols on finance.yahoo.com. The watch shows up to 7 characters; large values are shortened with k/M/B. ' +
                    'To price a coin in bitcoin (the old Satoshi option), use a pair like ETH-BTC with Auto decimals.'
            },
            {
                type: 'tabs',
                options: [
                    { label: 'A', group: 'ticker-A' },
                    { label: 'B', group: 'ticker-B' },
                    { label: 'C', group: 'ticker-C' },
                    { label: 'D', group: 'ticker-D' }
                ]
            }
        ]
        .concat(tickerItems(''))
        .concat(tickerItems('B'))
        .concat(tickerItems('C'))
        .concat(tickerItems('D'))
        .concat([
            {
                type: 'select',
                messageKey: 'KEY_CRYPTOTIME',
                label: 'Refresh (minutes)',
                defaultValue: 15,
                options: [
                    { label: '5 min',  value: 5  },
                    { label: '15 min', value: 15 },
                    { label: '30 min', value: 30 },
                    { label: '60 min', value: 60 }
                ]
            }
        ])
    },
    // -----------------------------------------------------------------------
    // Submit
    // -----------------------------------------------------------------------
    {
        type: 'submit',
        defaultValue: 'Save Settings'
    }
];

module.exports = config;
module.exports.SAME_AS_DEFAULT = SAME_AS_DEFAULT;
