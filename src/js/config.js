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
    { label: 'Wind',                value: 8  },
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
    { label: 'Crypto A',            value: 20 },
    { label: 'Crypto B',            value: 21 },
    { label: 'Crypto C',            value: 22 },
    { label: 'Crypto D',            value: 23 }
];

function slotSelect(label, messageKey, defaultValue) {
    return {
        type: 'select',
        messageKey: messageKey,
        label: label,
        defaultValue: defaultValue,
        options: MODULES
    };
}

module.exports = [
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
                defaultValue: ''
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
                defaultValue: ''
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
            },
            {
                type: 'select',
                messageKey: 'KEY_SPEEDUNIT',
                label: 'Wind speed unit',
                defaultValue: 0,
                options: [
                    { label: 'mph',   value: 0 },
                    { label: 'km/h',  value: 1 },
                    { label: 'knots', value: 2 }
                ]
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Widget Slots (Normal)
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Widget Slots (Normal Mode)' },
            { type: 'text', defaultValue: 'Slots A-D form a 2×2 grid around the clock. E is above, F is below.' },
            slotSelect('Slot A (top-left)',   'KEY_SLOTA', 1),
            slotSelect('Slot B (top-right)',  'KEY_SLOTB', 2),
            slotSelect('Slot C (bot-left)',   'KEY_SLOTC', 3),
            slotSelect('Slot D (bot-right)',  'KEY_SLOTD', 4),
            slotSelect('Slot E (above clock)', 'KEY_SLOTE', 18),
            slotSelect('Slot F (below clock)', 'KEY_SLOTF', 17)
        ]
    },
    // -----------------------------------------------------------------------
    // Widget Slots (Sleep mode)
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Widget Slots (Sleep Mode)' },
            slotSelect('Sleep Slot A', 'KEY_SLEEPSLOTA', 1),
            slotSelect('Sleep Slot B', 'KEY_SLEEPSLOTB', 2),
            slotSelect('Sleep Slot C', 'KEY_SLEEPSLOTC', 6),
            slotSelect('Sleep Slot D', 'KEY_SLEEPSLOTD', 7),
            slotSelect('Sleep Slot E', 'KEY_SLEEPSLOTE', 18),
            slotSelect('Sleep Slot F', 'KEY_SLEEPSLOTF', 17)
        ]
    },
    // -----------------------------------------------------------------------
    // Widget Slots (Tap mode)
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Widget Slots (Tap Mode)' },
            slotSelect('Tap Slot A', 'KEY_TAPSLOTA', 15),
            slotSelect('Tap Slot B', 'KEY_TAPSLOTB', 14),
            slotSelect('Tap Slot C', 'KEY_TAPSLOTC', 5),
            slotSelect('Tap Slot D', 'KEY_TAPSLOTD', 13),
            slotSelect('Tap Slot E', 'KEY_TAPSLOTE', 18),
            slotSelect('Tap Slot F', 'KEY_TAPSLOTF', 17)
        ]
    },
    // -----------------------------------------------------------------------
    // Widget Slots (Wrist-raise mode)
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Widget Slots (Wrist-Raise Mode)' },
            slotSelect('Wrist Slot A', 'KEY_WRISTSLOTA', 11),
            slotSelect('Wrist Slot B', 'KEY_WRISTSLOTB', 12),
            slotSelect('Wrist Slot C', 'KEY_WRISTSLOTC', 8),
            slotSelect('Wrist Slot D', 'KEY_WRISTSLOTD', 16),
            slotSelect('Wrist Slot E', 'KEY_WRISTSLOTE', 18),
            slotSelect('Wrist Slot F', 'KEY_WRISTSLOTF', 17)
        ]
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
                messageKey: 'KEY_SHOWSLEEP',
                label: 'Enable after wake up mode',
                defaultValue: false
            },
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
    // Tap & Wrist-Raise
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Tap & Wrist-Raise' },
            {
                type: 'toggle',
                messageKey: 'KEY_SHOWTAP',
                label: 'Enable tap mode',
                defaultValue: false
            },
            {
                type: 'select',
                messageKey: 'KEY_TAPTIME',
                label: 'Tap mode duration (seconds)',
                defaultValue: 7,
                options: [
                    { label: '5 s',  value: 5  },
                    { label: '7 s',  value: 7  },
                    { label: '10 s', value: 10 }
                ]
            },
            {
                type: 'toggle',
                messageKey: 'KEY_SHOWWRIST',
                label: 'Enable wrist shake mode',
                defaultValue: false
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
            { type: 'color', messageKey: 'KEY_WINDDIRCOLOR',      label: 'Wind direction',      defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_WINDSPEEDCOLOR',    label: 'Wind speed',          defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_COMPASSCOLOR',      label: 'Compass',             defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_SUNRISECOLOR',      label: 'Sunrise',             defaultValue: '0xFFFF00' },
            { type: 'color', messageKey: 'KEY_SUNSETCOLOR',       label: 'Sunset',              defaultValue: '0xFF8000' },
            { type: 'color', messageKey: 'KEY_SECONDSCOLOR',      label: 'Seconds',             defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CRYPTOCOLOR',       label: 'Crypto A',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CRYPTOBCOLOR',      label: 'Crypto B',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CRYPTOCCOLOR',      label: 'Crypto C',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'KEY_CRYPTODCOLOR',      label: 'Crypto D',            defaultValue: '0xFFFFFF' }
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
    // Cryptocurrency A
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Cryptocurrency A' },
            { type: 'input', messageKey: 'KEY_CRYPTOFROM',   label: 'From symbol (e.g. BTC)',   defaultValue: '' },
            { type: 'input', messageKey: 'KEY_CRYPTOTO',     label: 'To symbol (e.g. USD)',     defaultValue: '' },
            { type: 'input', messageKey: 'KEY_CRYPTOMARKET', label: 'Market (e.g. CCCAGG)',     defaultValue: 'CCCAGG' },
            {
                type: 'toggle',
                messageKey: 'KEY_CRYPTOMULTI',
                label: 'Show in Satoshis (×10⁻⁸)',
                defaultValue: false
            },
            {
                type: 'select',
                messageKey: 'KEY_CRYPTOTIME',
                label: 'Crypto refresh (minutes)',
                defaultValue: 15,
                options: [
                    { label: '5 min',  value: 5  },
                    { label: '15 min', value: 15 },
                    { label: '30 min', value: 30 },
                    { label: '60 min', value: 60 }
                ]
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Cryptocurrency B
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Cryptocurrency B' },
            { type: 'input', messageKey: 'KEY_CRYPTOFROMB',   label: 'From symbol', defaultValue: '' },
            { type: 'input', messageKey: 'KEY_CRYPTOTOB',     label: 'To symbol',   defaultValue: '' },
            { type: 'input', messageKey: 'KEY_CRYPTOMARKETB', label: 'Market',      defaultValue: 'CCCAGG' },
            {
                type: 'toggle',
                messageKey: 'KEY_CRYPTOMULTIB',
                label: 'Show in Satoshis',
                defaultValue: false
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Cryptocurrency C
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Cryptocurrency C' },
            { type: 'input', messageKey: 'KEY_CRYPTOFROMC',   label: 'From symbol', defaultValue: '' },
            { type: 'input', messageKey: 'KEY_CRYPTOTOC',     label: 'To symbol',   defaultValue: '' },
            { type: 'input', messageKey: 'KEY_CRYPTOMARKETC', label: 'Market',      defaultValue: 'CCCAGG' },
            {
                type: 'toggle',
                messageKey: 'KEY_CRYPTOMULTIC',
                label: 'Show in Satoshis',
                defaultValue: false
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Cryptocurrency D
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Cryptocurrency D' },
            { type: 'input', messageKey: 'KEY_CRYPTOFROMD',   label: 'From symbol', defaultValue: '' },
            { type: 'input', messageKey: 'KEY_CRYPTOTOD',     label: 'To symbol',   defaultValue: '' },
            { type: 'input', messageKey: 'KEY_CRYPTOMARKETD', label: 'Market',      defaultValue: 'CCCAGG' },
            {
                type: 'toggle',
                messageKey: 'KEY_CRYPTOMULTID',
                label: 'Show in Satoshis',
                defaultValue: false
            }
        ]
    },
    // -----------------------------------------------------------------------
    // Submit
    // -----------------------------------------------------------------------
    {
        type: 'submit',
        defaultValue: 'Save Settings'
    }
];
