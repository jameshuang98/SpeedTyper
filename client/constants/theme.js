const COLORS = {
    gray: "#83829A",
    gray2: "#C1C0C8",

    white: "#FFFFFF",
    lightWhite: "#f2f2f2",
    lighterWhite: "#f9f9f9",
    
    primary: "#0c2431",
    secondary: "#194a50",
    tertiary: "#d37556",
    peach: "#d8a28c",
    pastel: "#f0eae3"


};

const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32,
};

const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2
    },
    medium: {
        wColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },
};

export { COLORS, SIZES, SHADOWS };
