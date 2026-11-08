#include <pebble.h>
#include "positions.h"
#include "keys.h"
#include "configs.h"

GPoint create_point(int x, int y) {
    struct GPoint point;
    point.x = x;
    point.y = y;
    return point;
}

// Layout values are tuned for the 144x168 rectangular watches (basalt,
// diorite, and flint, the Core 2 Duo, which is the same size as Pebble 2)
// and chalk (180x180). emery (200x228) is ~7/5 of that rectangle,
// gabbro (260x260) is 13/9 of chalk.
#if defined(PBL_PLATFORM_EMERY)
#define SCALE(v) ((v) * 7 / 5)
#elif defined(PBL_PLATFORM_GABBRO)
#define SCALE(v) ((v) * 13 / 9)
#else
#define SCALE(v) (v)
#endif


#ifndef PBL_ROUND
#if defined(PBL_PLATFORM_EMERY)
static int module_height = 36;
#else
static int module_height = 26;
#endif

static int get_pos(int alignment, int left_pos, int center_pos, int right_pos) {
    switch (alignment) {
        case GTextAlignmentLeft:
            return left_pos;
            break;
        case GTextAlignmentCenter:
            return center_pos;
            break;
        case GTextAlignmentRight:
            return right_pos;
            break;
    }
    return right_pos;
}
#endif

static void get_text_positions_blocko(GTextAlignment align, struct TextPositions* positions, int width, int height) {
    int midpoint = height / 2;
    positions->hours = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint - SCALE(46)
    );
    positions->date = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint + SCALE(6)
    );
    positions->bluetooth = create_point(
        PBL_IF_ROUND_ELSE(SCALE(134), get_pos(align, -4, width - 18, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(34),
            get_pos(align, midpoint - SCALE(24), midpoint + SCALE(34), midpoint - SCALE(24))
        )
    );
    positions->updates = create_point(
        PBL_IF_ROUND_ELSE(SCALE(120), get_pos(align, -4, width - 32, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(34),
            get_pos(align, midpoint - SCALE(6), midpoint + SCALE(34), midpoint - SCALE(6))
        )
    );
}

static void get_text_positions_blocko_big(GTextAlignment align, struct TextPositions* positions, int width, int height) {
    int midpoint = height / 2;
    positions->hours = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint - SCALE(52)
    );
    positions->date = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint + SCALE(4)
    );
    positions->bluetooth = create_point(
        PBL_IF_ROUND_ELSE(SCALE(134), get_pos(align, -4, width - 18, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
            get_pos(align, midpoint - SCALE(30), midpoint + SCALE(40), midpoint - SCALE(30))
        )
    );
    positions->updates = create_point(
        PBL_IF_ROUND_ELSE(SCALE(120), get_pos(align, -4, width - 32, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
            get_pos(align, midpoint - SCALE(8), midpoint + SCALE(40), midpoint - SCALE(8))
        )
    );
}

static void get_text_positions_system(GTextAlignment align, struct TextPositions* positions, int width, int height) {
    int midpoint = height / 2;
    positions->hours = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint - SCALE(42)
    );
    positions->date = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint + SCALE(2)
    );
    positions->bluetooth = create_point(
        PBL_IF_ROUND_ELSE(SCALE(134), get_pos(align, -4, width - 18, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
                get_pos(align, midpoint - SCALE(30), midpoint + SCALE(40), midpoint - SCALE(30))
            )
    );
    positions->updates = create_point(
        PBL_IF_ROUND_ELSE(SCALE(120), get_pos(align, -4, width - 32, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
                get_pos(align, midpoint - SCALE(8), midpoint + SCALE(40), midpoint - SCALE(8))
            )
    );
}

static void get_text_positions_archivo(GTextAlignment align, struct TextPositions* positions, int width, int height) {
    int midpoint = height / 2;
    positions->hours = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint - SCALE(44)
    );
    positions->date = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint + SCALE(8)
    );
    positions->bluetooth = create_point(
        PBL_IF_ROUND_ELSE(SCALE(134), get_pos(align, -4, width - 18, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
            get_pos(align, midpoint - SCALE(30), midpoint + SCALE(40), midpoint - SCALE(30))
        )
    );
    positions->updates = create_point(
        PBL_IF_ROUND_ELSE(SCALE(120), get_pos(align, -4, width - 32, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
            get_pos(align, midpoint - SCALE(8), midpoint + SCALE(40), midpoint - SCALE(8))
        )
    );
}

static void get_text_positions_din(GTextAlignment align, struct TextPositions* positions, int width, int height) {
    int midpoint = height / 2;
    positions->hours = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint - SCALE(45)
    );
    positions->date = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint + SCALE(8)
    );
    positions->bluetooth = create_point(
        PBL_IF_ROUND_ELSE(SCALE(134), get_pos(align, -4, width - 18, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
            get_pos(align, midpoint - SCALE(30), midpoint + SCALE(40), midpoint - SCALE(30))
        )
    );
    positions->updates = create_point(
        PBL_IF_ROUND_ELSE(SCALE(120), get_pos(align, -4, width - 32, 0)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
            get_pos(align, midpoint - SCALE(8), midpoint + SCALE(40), midpoint - SCALE(8))
        )
    );
}

static void get_text_positions_prototype(GTextAlignment align, struct TextPositions* positions, int width, int height) {
    int midpoint = height / 2;
    positions->hours = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint - SCALE(40)
    );
    positions->date = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint + SCALE(8)
    );
    positions->bluetooth = create_point(
        PBL_IF_ROUND_ELSE(SCALE(134), get_pos(align, -2, width - 18, -2)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(34),
            get_pos(align, midpoint - SCALE(24), midpoint + SCALE(34), midpoint - SCALE(24))
        )
    );
    positions->updates = create_point(
        PBL_IF_ROUND_ELSE(SCALE(120), get_pos(align, -2, width - 32, -2)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(34),
            get_pos(align, midpoint - SCALE(6), midpoint + SCALE(34), midpoint - SCALE(6))
        )
    );
}

static void get_text_positions_leco(GTextAlignment align, struct TextPositions* positions, int width, int height) {
    int midpoint = height / 2;
    positions->hours = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint - SCALE(38)
    );
    positions->date = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint + SCALE(9)
    );
    positions->bluetooth = create_point(
        PBL_IF_ROUND_ELSE(SCALE(134), get_pos(align, -4, width - 18, -2)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(34),
            get_pos(align, midpoint - SCALE(26), midpoint + SCALE(34), midpoint - SCALE(26))
        )
    );
    positions->updates = create_point(
        PBL_IF_ROUND_ELSE(SCALE(120), get_pos(align, -4, width - 32, -2)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(34),
            get_pos(align, midpoint - SCALE(8), midpoint + SCALE(34), midpoint - SCALE(8))
        )
    );
}

static void get_text_positions_konstruct(GTextAlignment align, struct TextPositions* positions, int width, int height) {
    int midpoint = height / 2;
    positions->hours = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint - SCALE(24)
    );
    positions->date = create_point(
        PBL_IF_ROUND_ELSE(SCALE(0), 2),
        midpoint + SCALE(10)
    );
    positions->bluetooth = create_point(
        PBL_IF_ROUND_ELSE(SCALE(134), get_pos(align, -4, width - 18, -2)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
            get_pos(align, midpoint - SCALE(30), midpoint + SCALE(40), midpoint - SCALE(30))
        )
    );
    positions->updates = create_point(
        PBL_IF_ROUND_ELSE(SCALE(120), get_pos(align, -4, width - 32, -2)),
        PBL_IF_ROUND_ELSE(midpoint + SCALE(40),
            get_pos(align, midpoint - SCALE(8), midpoint + SCALE(40), midpoint - SCALE(8))
        )
    );
}

void get_text_positions(int selected_font, GTextAlignment alignment, struct TextPositions* positions, int width, int height) {
    switch(selected_font) {
        case BLOCKO_FONT:
            get_text_positions_blocko(alignment, positions, width, height);
            break;
        case BLOCKO_BIG_FONT:
            get_text_positions_blocko_big(alignment, positions, width, height);
            break;
        case SYSTEM_FONT:
            get_text_positions_system(alignment, positions, width, height);
            break;
        case ARCHIVO_FONT:
            get_text_positions_archivo(alignment, positions, width, height);
            break;
        case DIN_FONT:
            get_text_positions_din(alignment, positions, width, height);
            break;
        case PROTOTYPE_FONT:
            get_text_positions_prototype(alignment, positions, width, height);
            break;
        case LECO_FONT:
            get_text_positions_leco(alignment, positions, width, height);
            break;
        case KONSTRUCT_FONT:
            get_text_positions_konstruct(alignment, positions, width, height);
            break;
        default:
            get_text_positions_blocko(alignment, positions, width, height);
    }
};

static GPoint get_weather_positions(int mode, int font, int width, int height) {
    // weather condition
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case BLOCKO_BIG_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(-14), 0), 0);
                case PROTOTYPE_FONT:
                case LECO_FONT:
                case KONSTRUCT_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(-16), 0), 0);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_temp_positions(int mode, int font, int width, int height) {
    // current temperature
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(16), SCALE(38)), 3);
                case PROTOTYPE_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(18), SCALE(40)), 3);
                case BLOCKO_BIG_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(16), SCALE(38)), 3);
                case LECO_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(15), SCALE(39)), 5);
                case KONSTRUCT_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(15), SCALE(39)), 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_tempmin_positions(int mode, int font, int width, int height) {
    // min temperature
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(70), SCALE(12)), 3);
                case BLOCKO_BIG_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(70), SCALE(12)), 3);
                case LECO_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(68), SCALE(10)), 5);
                case KONSTRUCT_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(68), SCALE(10)), 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_tempminicon_positions(int mode, int font, int width, int height) {
    // min temperature
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case PROTOTYPE_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(60), SCALE(2)), 4);
                case DIN_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(60), SCALE(2)), 4);
                case BLOCKO_BIG_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(60), SCALE(2)), 4);
                case LECO_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(59), SCALE(1)), 3);
                case KONSTRUCT_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(59), SCALE(1)), 5);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_tempmax_positions(int mode, int font, int width, int height) {
    // max temperature
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(108), SCALE(45)), 3);
                case BLOCKO_BIG_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(108), SCALE(45)), 3);
                case LECO_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(108), SCALE(45)), 5);
                case KONSTRUCT_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(108), SCALE(45)), 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_tempmaxicon_positions(int mode, int font, int width, int height) {
    // max temperature
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case PROTOTYPE_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(98), SCALE(35)), 4);
                case DIN_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(98), SCALE(35)), 4);
                case BLOCKO_BIG_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(98), SCALE(35)), 4);
                case LECO_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(99), SCALE(36)), 3);
                case KONSTRUCT_FONT:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(99), SCALE(36)), 5);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

#if defined(PBL_HEALTH)
static GPoint get_heart_positions(int mode, int font, int width, int height) {
    // heart
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(96), SCALE(38));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 5);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_heart_icon_positions(int mode, int font, int width, int height) {
    // heart icon
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(64), SCALE(8));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                    return create_point(x_pos, 4);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 5);
                case SYSTEM_FONT:
                    return create_point(x_pos, 5);
                case ARCHIVO_FONT:
                    return create_point(x_pos, 5);
                case DIN_FONT:
                    return create_point(x_pos, 6);
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 4);
                case LECO_FONT:
                    return create_point(x_pos, 5);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 6);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};
#endif

static GPoint get_speed_positions(int mode, int font, int width, int height) {
    // wind speed
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(56), SCALE(6));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 5);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_direction_positions(int mode, int font, int width, int height) {
    // wind direction
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(56), SCALE(4));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case BLOCKO_BIG_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 5);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 5);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_wind_unit_positions(int mode, int font, int width, int height) {
    // wind unit
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(100), SCALE(48));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                    return create_point(x_pos, 1);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 3);
                case SYSTEM_FONT:
                    return create_point(x_pos, 3);
                case ARCHIVO_FONT:
                    return create_point(x_pos, 2);
                case DIN_FONT:
                    return create_point(x_pos, 3);
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 1);
                case LECO_FONT:
                    return create_point(x_pos, 1);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 2);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_sunrise_positions(int mode, int font, int width, int height) {
    // sunrise
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(86), SCALE(22));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 5);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_sunrise_icon_positions(int mode, int font, int width, int height) {
    // sunrise icon
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(60), 0);
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                    return create_point(x_pos, 3);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 4);
                case SYSTEM_FONT:
                    return create_point(x_pos, 4);
                case ARCHIVO_FONT:
                    return create_point(x_pos, 4);
                case DIN_FONT:
                    return create_point(x_pos, 5);
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 4);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 5);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_sunset_positions(int mode, int font, int width, int height) {
    // sunset
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(-86), SCALE(-24));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 5);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_sunset_icon_positions(int mode, int font, int width, int height) {
    // sunset icon
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(-60), SCALE(-4));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                    return create_point(x_pos, 3);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 4);
                case SYSTEM_FONT:
                    return create_point(x_pos, 4);
                case ARCHIVO_FONT:
                    return create_point(x_pos, 4);
                case DIN_FONT:
                    return create_point(x_pos, 5);
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 4);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 5);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_degrees_positions(int mode, int font, int width, int height) {
    // compass degrees
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(82), SCALE(30));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case BLOCKO_BIG_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 5);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_compass_positions(int mode, int font, int width, int height) {
    // compass arrow
    int x_pos = PBL_IF_ROUND_ELSE(SCALE(60), SCALE(8));
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case BLOCKO_BIG_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(x_pos, 3);
                case LECO_FONT:
                    return create_point(x_pos, 5);
                case KONSTRUCT_FONT:
                    return create_point(x_pos, 5);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_text_only_positions(int mode, int font, int width, int height) {
    // text-only modules
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                case SYSTEM_FONT:
                case ARCHIVO_FONT:
                case DIN_FONT:
                case PROTOTYPE_FONT:
                    return create_point(0, 3);
                case BLOCKO_BIG_FONT:
                    return create_point(0, 3);
                case LECO_FONT:
                    return create_point(0, 5);
                case KONSTRUCT_FONT:
                    return create_point(0, 9);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_slot_e_positions(int mode, int font, int width, int height) {
    int midpoint = height / 2;
    // position for slot e
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                    return create_point(2, midpoint - SCALE(48));
                case BLOCKO_BIG_FONT:
                    return create_point(2, midpoint - SCALE(55));
                case SYSTEM_FONT:
                    return create_point(2, midpoint - SCALE(53));
                case ARCHIVO_FONT:
                    return create_point(2, midpoint - SCALE(51));
                case DIN_FONT:
                    return create_point(2, midpoint - SCALE(55));
                case PROTOTYPE_FONT:
                    return create_point(2, midpoint - SCALE(51));
                case LECO_FONT:
                    return create_point(2, midpoint - SCALE(48));
                case KONSTRUCT_FONT:
                    return create_point(2, midpoint - SCALE(41));
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

static GPoint get_slot_f_positions(int mode, int font, int width, int height) {
    int midpoint = height / 2;
    // position for slot f
    switch (mode) {
        case MODE_NORMAL:
            switch(font) {
                case BLOCKO_FONT:
                    return create_point(2, midpoint + SCALE(24));
                case BLOCKO_BIG_FONT:
                    return create_point(2, midpoint + SCALE(29));
                case SYSTEM_FONT:
                    return create_point(2, midpoint + SCALE(25));
                case ARCHIVO_FONT:
                    return create_point(2, midpoint + SCALE(31));
                case DIN_FONT:
                    return create_point(2, midpoint + SCALE(29));
                case PROTOTYPE_FONT:
                    return create_point(2, midpoint + SCALE(27));
                case LECO_FONT:
                    return create_point(2, midpoint + SCALE(26));
                case KONSTRUCT_FONT:
                    return create_point(2, midpoint + SCALE(19));
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

GPoint get_slot_positions(int mode, int slot, int width, int height, int font) {
    switch (mode) {
        case MODE_NORMAL:
            switch(slot) {
                case SLOT_A:
                    return create_point(2, 0);
                case SLOT_B:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(2), width / 2), PBL_IF_ROUND_ELSE(SCALE(18), 0));
                case SLOT_C:
                    return create_point(2, PBL_IF_ROUND_ELSE(SCALE(136), height - module_height));
                case SLOT_D:
                    return create_point(PBL_IF_ROUND_ELSE(SCALE(2), width / 2), PBL_IF_ROUND_ELSE(SCALE(152), height - module_height));
                case SLOT_E:
                    return get_slot_e_positions(mode, font, width, height);
                case SLOT_F:
                    return get_slot_f_positions(mode, font, width, height);
            }
            break;
        default:
            return create_point(0, 0);
    }

    return create_point(0, 0);
};

GPoint get_pos_for_item(int slot, int item, int mode, int font, int width, int height) {
    if (slot == -1) {
        return create_point(0, 0);
    }
    GPoint slot_pos = get_slot_positions(mode, slot, width, height, font);
    GPoint item_pos;
    switch (item) {
        case WEATHER_ITEM:
            item_pos = get_weather_positions(mode, font, width, height);
            break;
        case TEMP_ITEM:
            item_pos = get_temp_positions(mode, font, width, height);
            break;
        case TEMPMIN_ITEM:
            item_pos = get_tempmin_positions(mode, font, width, height);
            break;
        case TEMPMAX_ITEM:
            item_pos = get_tempmax_positions(mode, font, width, height);
            break;
        #if defined(PBL_HEALTH)
        case STEPS_ITEM:
        case DIST_ITEM:
        case CAL_ITEM:
        case SLEEP_ITEM:
        case DEEP_ITEM:
        case ACTIVE_ITEM:
            item_pos = get_text_only_positions(mode, font, width, height);
            break;
        case HEART_ITEM:
            item_pos = get_heart_positions(mode, font, width, height);
            break;
        case HEARTICON_ITEM:
            item_pos = get_heart_icon_positions(mode, font, width, height);
            break;
        #endif
        case SPEED_ITEM:
            item_pos = get_speed_positions(mode, font, width, height);
            break;
        case DIRECTION_ITEM:
            item_pos = get_direction_positions(mode, font, width, height);
            break;
        case WIND_UNIT_ITEM:
            item_pos = get_wind_unit_positions(mode, font, width, height);
            break;
        case TEMPMINICON_ITEM:
            item_pos = get_tempminicon_positions(mode, font, width, height);
            break;
        case TEMPMAXICON_ITEM:
            item_pos = get_tempmaxicon_positions(mode, font, width, height);
            break;
        case SUNRISE_ITEM:
            item_pos = get_sunrise_positions(mode, font, width, height);
            break;
        case SUNSET_ITEM:
            item_pos = get_sunset_positions(mode, font, width, height);
            break;
        case SUNRISEICON_ITEM:
            item_pos = get_sunrise_icon_positions(mode, font, width, height);
            break;
        case SUNSETICON_ITEM:
            item_pos = get_sunset_icon_positions(mode, font, width, height);
            break;
        case DEGREES_ITEM:
            item_pos = get_degrees_positions(mode, font, width, height);
            break;
        case COMPASS_ITEM:
            item_pos = get_compass_positions(mode, font, width, height);
            break;
        case SECONDS_ITEM:
        case BATTERY_ITEM:
        case TIMEZONE_ITEM:
            item_pos = get_text_only_positions(mode, font, width, height);
            break;
        #if !defined PBL_PLATFORM_APLITE
        case CRYPTO_ITEM:
        case TIMEZONEB_ITEM:
            item_pos = get_text_only_positions(mode, font, width, height);
            break;
        #endif
    }
    return create_point(slot_pos.x + item_pos.x, slot_pos.y + item_pos.y);
}
