/*jshint node: true*/
'use strict';

// Widget module options (shared across all slot selects)
var MODULES = [
    { label: 'None',                value: -1 },
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
                messageKey: 'FONTTYPE',
                label: 'Font',
                defaultValue: 6,
                options: [
                    { label: 'Blocko',          value: 0 },
                    { label: 'Blocko Big',       value: 1 },
                    { label: 'System',           value: 2 },
                    { label: 'Archivo Narrow',   value: 3 },
                    { label: 'OSP-DIN',          value: 4 },
                    { label: 'Prototype',        value: 5 },
                    { label: 'LECO',             value: 6 },
                    { label: 'Konstruct',        value: 7 }
                ]
            },
            {
                type: 'select',
                messageKey: 'TEXTALIGN',
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
                messageKey: 'SIMPLEMODE',
                label: 'Simple Mode (clock only)',
                defaultValue: false
            },
            {
                type: 'toggle',
                messageKey: 'ENABLEADVANCED',
                label: 'Show advanced info',
                defaultValue: true
            },
            {
                type: 'toggle',
                messageKey: 'QUICKVIEW',
                label: 'Avoid Quick View bar',
                defaultValue: false
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
                messageKey: 'DATEFORMAT',
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
                messageKey: 'DATESEPARATOR',
                label: 'Date Separator',
                defaultValue: 0,
                options: [
                    { label: 'Slash (/)',  value: 0 },
                    { label: 'Dot (.)',    value: 1 },
                    { label: 'Dash (-)',   value: 2 },
                    { label: 'Space ( )', value: 3 }
                ]
            },
            {
                type: 'toggle',
                messageKey: 'LEADINGZERO',
                label: 'Leading zero on hour',
                defaultValue: false
            },
            {
                type: 'select',
                messageKey: 'LOCALE',
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
                messageKey: 'TIMEZONESCODE',
                label: 'Label (e.g. UTC)',
                defaultValue: ''
            },
            {
                type: 'select',
                messageKey: 'TIMEZONES',
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
                messageKey: 'TIMEZONESMINUTES',
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
                messageKey: 'TIMEZONESBCODE',
                label: 'Label (e.g. EST)',
                defaultValue: ''
            },
            {
                type: 'select',
                messageKey: 'TIMEZONESB',
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
                messageKey: 'TIMEZONESBMINUTES',
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
                messageKey: 'ENABLEWEATHER',
                label: 'Enable weather widgets',
                defaultValue: true
            },
            {
                type: 'toggle',
                messageKey: 'USECELSIUS',
                label: 'Use Celsius',
                defaultValue: true
            },
            {
                type: 'select',
                messageKey: 'WEATHERTIME',
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
                messageKey: 'SPEEDUNIT',
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
            slotSelect('Slot A (top-left)',   'SLOTA', 1),
            slotSelect('Slot B (top-right)',  'SLOTB', 2),
            slotSelect('Slot C (bot-left)',   'SLOTC', 3),
            slotSelect('Slot D (bot-right)',  'SLOTD', 14),
            slotSelect('Slot E (above clock)', 'SLOTE', 18),
            slotSelect('Slot F (below clock)', 'SLOTF', 19)
        ]
    },
    // -----------------------------------------------------------------------
    // Widget Slots (Sleep mode)
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Widget Slots (Sleep Mode)' },
            slotSelect('Sleep Slot A', 'SLEEPSLOTA', 6),
            slotSelect('Sleep Slot B', 'SLEEPSLOTB', 7),
            slotSelect('Sleep Slot C', 'SLEEPSLOTC', -1),
            slotSelect('Sleep Slot D', 'SLEEPSLOTD', -1),
            slotSelect('Sleep Slot E', 'SLEEPSLOTE', -1),
            slotSelect('Sleep Slot F', 'SLEEPSLOTF', -1)
        ]
    },
    // -----------------------------------------------------------------------
    // Widget Slots (Tap mode)
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Widget Slots (Tap Mode)' },
            slotSelect('Tap Slot A', 'TAPSLOTA', -1),
            slotSelect('Tap Slot B', 'TAPSLOTB', -1),
            slotSelect('Tap Slot C', 'TAPSLOTC', -1),
            slotSelect('Tap Slot D', 'TAPSLOTD', -1),
            slotSelect('Tap Slot E', 'TAPSLOTE', -1),
            slotSelect('Tap Slot F', 'TAPSLOTF', -1)
        ]
    },
    // -----------------------------------------------------------------------
    // Widget Slots (Wrist-raise mode)
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Widget Slots (Wrist-Raise Mode)' },
            slotSelect('Wrist Slot A', 'WRISTSLOTA', -1),
            slotSelect('Wrist Slot B', 'WRISTSLOTB', -1),
            slotSelect('Wrist Slot C', 'WRISTSLOTC', -1),
            slotSelect('Wrist Slot D', 'WRISTSLOTD', -1),
            slotSelect('Wrist Slot E', 'WRISTSLOTE', -1),
            slotSelect('Wrist Slot F', 'WRISTSLOTF', -1)
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
                messageKey: 'BLUETOOTHDISCONNECT',
                label: 'Vibrate on Bluetooth disconnect',
                defaultValue: true
            },
            {
                type: 'toggle',
                messageKey: 'UPDATE',
                label: 'Show update notification',
                defaultValue: false
            },
            {
                type: 'toggle',
                messageKey: 'MUTEONQUIET',
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
                messageKey: 'ENABLEHEALTH',
                label: 'Enable health tracking',
                defaultValue: true
            },
            {
                type: 'toggle',
                messageKey: 'SHOWSLEEP',
                label: 'Show sleep data',
                defaultValue: true
            },
            {
                type: 'toggle',
                messageKey: 'USEKM',
                label: 'Use kilometers for distance',
                defaultValue: false
            },
            {
                type: 'toggle',
                messageKey: 'USECAL',
                label: 'Show calories (not kcal)',
                defaultValue: false
            },
            {
                type: 'input',
                messageKey: 'HEARTLOW',
                label: 'Heart rate low threshold',
                defaultValue: '60',
                attributes: { type: 'number', min: 0, max: 300 }
            },
            {
                type: 'input',
                messageKey: 'HEARTHIGH',
                label: 'Heart rate high threshold',
                defaultValue: '100',
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
                messageKey: 'SHOWTAP',
                label: 'Enable tap mode',
                defaultValue: false
            },
            {
                type: 'select',
                messageKey: 'TAPTIME',
                label: 'Tap mode duration (seconds)',
                defaultValue: 7,
                options: [
                    { label: '5 s',  value: 5  },
                    { label: '7 s',  value: 7  },
                    { label: '10 s', value: 10 },
                    { label: '15 s', value: 15 }
                ]
            },
            {
                type: 'toggle',
                messageKey: 'SHOWWRIST',
                label: 'Enable wrist-raise mode',
                defaultValue: true
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
            { type: 'color', messageKey: 'BGCOLOR',           label: 'Background',         defaultValue: '0x000000' },
            { type: 'color', messageKey: 'HOURSCOLOR',        label: 'Hours',               defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'ALTHOURSCOLOR',     label: 'Alt Hours (Tz A)',     defaultValue: '0xAAAAAA' },
            { type: 'color', messageKey: 'ALTHOURSBCOLOR',    label: 'Alt Hours (Tz B)',     defaultValue: '0xAAAAAA' },
            { type: 'color', messageKey: 'DATECOLOR',         label: 'Date',                defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'BLUETOOTHCOLOR',    label: 'Bluetooth icon',      defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'UPDATECOLOR',       label: 'Update icon',         defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'BATTERYCOLOR',      label: 'Battery',             defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'BATTERYLOWCOLOR',   label: 'Battery low',         defaultValue: '0xFF0000' },
            { type: 'color', messageKey: 'TEMPCOLOR',         label: 'Temperature',         defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'WEATHERCOLOR',      label: 'Weather icon',        defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'MINCOLOR',          label: 'Min temperature',     defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'MAXCOLOR',          label: 'Max temperature',     defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'WINDDIRCOLOR',      label: 'Wind direction',      defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'WINDSPEEDCOLOR',    label: 'Wind speed',          defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'COMPASSCOLOR',      label: 'Compass',             defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'SUNRISECOLOR',      label: 'Sunrise',             defaultValue: '0xFFFF00' },
            { type: 'color', messageKey: 'SUNSETCOLOR',       label: 'Sunset',              defaultValue: '0xFF8000' },
            { type: 'color', messageKey: 'SECONDSCOLOR',      label: 'Seconds',             defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'CRYPTOCOLOR',       label: 'Crypto A',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'CRYPTOBCOLOR',      label: 'Crypto B',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'CRYPTOCCOLOR',      label: 'Crypto C',            defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'CRYPTODCOLOR',      label: 'Crypto D',            defaultValue: '0xFFFFFF' }
        ]
    },
    // -----------------------------------------------------------------------
    // Health Colors
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Health Colors' },
            { type: 'color', messageKey: 'STEPSCOLOR',       label: 'Steps',              defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'STEPSBEHINDCOLOR', label: 'Steps (behind goal)', defaultValue: '0x777777' },
            { type: 'color', messageKey: 'DISTCOLOR',        label: 'Distance',           defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'DISTBEHINDCOLOR',  label: 'Distance (behind)',   defaultValue: '0x777777' },
            { type: 'color', messageKey: 'CALCOLOR',         label: 'Calories',           defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'CALBEHINDCOLOR',   label: 'Calories (behind)',   defaultValue: '0x777777' },
            { type: 'color', messageKey: 'SLEEPCOLOR',       label: 'Sleep',              defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'SLEEPBEHINDCOLOR', label: 'Sleep (behind goal)', defaultValue: '0x777777' },
            { type: 'color', messageKey: 'DEEPCOLOR',        label: 'Deep sleep',         defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'DEEPBEHINDCOLOR',  label: 'Deep sleep (behind)', defaultValue: '0x777777' },
            { type: 'color', messageKey: 'ACTIVECOLOR',      label: 'Active calories',    defaultValue: '0xFFFFFF' },
            { type: 'color', messageKey: 'ACTIVEBEHINDCOLOR',label: 'Active (behind)',     defaultValue: '0x777777' },
            { type: 'color', messageKey: 'HEARTCOLOR',       label: 'Heart rate',         defaultValue: '0xFF0000' },
            { type: 'color', messageKey: 'HEARTCOLOROFF',    label: 'Heart rate (resting)',defaultValue: '0xAA0000' }
        ]
    },
    // -----------------------------------------------------------------------
    // Cryptocurrency A
    // -----------------------------------------------------------------------
    {
        type: 'section',
        items: [
            { type: 'heading', defaultValue: 'Cryptocurrency A' },
            { type: 'input', messageKey: 'CRYPTOFROM',   label: 'From symbol (e.g. BTC)',   defaultValue: '' },
            { type: 'input', messageKey: 'CRYPTOTO',     label: 'To symbol (e.g. USD)',     defaultValue: '' },
            { type: 'input', messageKey: 'CRYPTOMARKET', label: 'Market (e.g. CCCAGG)',     defaultValue: 'CCCAGG' },
            {
                type: 'toggle',
                messageKey: 'CRYPTOMULTI',
                label: 'Show in Satoshis (×10⁻⁸)',
                defaultValue: false
            },
            {
                type: 'select',
                messageKey: 'CRYPTOTIME',
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
            { type: 'input', messageKey: 'CRYPTOFROMB',   label: 'From symbol', defaultValue: '' },
            { type: 'input', messageKey: 'CRYPTOTOB',     label: 'To symbol',   defaultValue: '' },
            { type: 'input', messageKey: 'CRYPTOMARKETB', label: 'Market',      defaultValue: 'CCCAGG' },
            {
                type: 'toggle',
                messageKey: 'CRYPTOMULTIB',
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
            { type: 'input', messageKey: 'CRYPTOFROMC',   label: 'From symbol', defaultValue: '' },
            { type: 'input', messageKey: 'CRYPTOTOC',     label: 'To symbol',   defaultValue: '' },
            { type: 'input', messageKey: 'CRYPTOMARKETC', label: 'Market',      defaultValue: 'CCCAGG' },
            {
                type: 'toggle',
                messageKey: 'CRYPTOMULTIC',
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
            { type: 'input', messageKey: 'CRYPTOFROMD',   label: 'From symbol', defaultValue: '' },
            { type: 'input', messageKey: 'CRYPTOTOD',     label: 'To symbol',   defaultValue: '' },
            { type: 'input', messageKey: 'CRYPTOMARKETD', label: 'Market',      defaultValue: 'CCCAGG' },
            {
                type: 'toggle',
                messageKey: 'CRYPTOMULTID',
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
