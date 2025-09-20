// === floating.js ===
const FP = (() => {
    let fp_value = 0.0;

    return {
        // Scalars like in the C code
        scalar0: 0.0,
        scalar1: 1.0,
        scalar2: 2.0,
        scalarHalf: 0.5,
        scalar10: 10.0,

        // Basic set/get
        set(value) { fp_value = value; },
        setInteger(value) { fp_value = value; },
        setZero() { fp_value = 0.0; },
        copyTo() { return fp_value; },
        asInteger() { return Math.trunc(fp_value); },

        // Arithmetic
        add(value) { fp_value += value; },
        sub(value) { fp_value -= value; },
        mul(value) { fp_value *= value; },
        div(value) { fp_value /= value; },

        // Unary
        abs() { fp_value = Math.abs(fp_value); },
        negate() { fp_value = -fp_value; },
        powerOfTen(n) { fp_value = 10 ** n; },

        // Compare / sign
        compareTo(value) {
            if (fp_value === value) return 0;
            return fp_value < value ? -1 : 1;
        },
        sign() {
            if (fp_value === 0) return 0;
            return fp_value < 0 ? -1 : 1;
        },

        // Trig / sqrt
        sin() { fp_value = Math.sin(fp_value); },
        cos() { fp_value = Math.cos(fp_value); },
        sqrt() { fp_value = Math.sqrt(fp_value); },

        // For debugging / access
        get value() { return fp_value; },
        set value(v) { fp_value = v; }
    };
})();
