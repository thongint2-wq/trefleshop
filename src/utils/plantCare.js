function hasValue(value) {
    return value !== null &&
        value !== undefined &&
        (typeof value !== "string" || value.trim() !== "");
}

export function formatRange(minimum, maximum) {
    if (!hasValue(minimum) && !hasValue(maximum)) {
        return null;
    }

    if (hasValue(minimum) && hasValue(maximum)) {
        return `${minimum} - ${maximum}`;
    }

    return hasValue(minimum) ? `ตั้งแต่ ${minimum}` : `สูงสุด ${maximum}`;
}

function formatTemperatureRange(minimum, maximum) {
    const celsius = formatRange(minimum?.deg_c, maximum?.deg_c);
    const fahrenheit = formatRange(minimum?.deg_f, maximum?.deg_f);
    const values = [];

    if (celsius) values.push(`${celsius} °C`);
    if (fahrenheit) values.push(`${fahrenheit} °F`);

    return values.length ? values.join(" / ") : null;
}

function formatMonths(months) {
    if (!Array.isArray(months) || months.length === 0) {
        return null;
    }

    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
        "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
        "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const englishMonthNames = [
        ["jan", "january"], ["feb", "february"], ["mar", "march"],
        ["apr", "april"], ["may"], ["jun", "june"],
        ["jul", "july"], ["aug", "august"], ["sep", "september"],
        ["oct", "october"], ["nov", "november"], ["dec", "december"]
    ];

    return months.map(month => {
        const monthNumber = Number(month);
        if (Number.isInteger(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
            return monthNames[monthNumber - 1];
        }

        const normalizedMonth = String(month).trim().toLowerCase();
        const englishMonthIndex = englishMonthNames.findIndex(aliases =>
            aliases.includes(normalizedMonth)
        );

        return englishMonthIndex >= 0
            ? monthNames[englishMonthIndex]
            : String(month);
    }).join(", ");
}

export function getPlantCareSections(plant) {
    const growth = plant.main_species?.growth || plant.growth || {};
    return [
        {
            title: "แสงแดด",
            metrics: [{ label: "ความต้องการแสง", score: growth.light }]
        },
        {
            title: "น้ำและความชื้น",
            metrics: [
                { label: "ความชื้นในอากาศ", score: growth.atmospheric_humidity },
                { label: "ความชื้นในดิน", score: growth.soil_humidity }
            ]
        },
        {
            title: "อุณหภูมิที่เหมาะสม",
            metrics: [{
                label: "ช่วงอุณหภูมิต่ำสุดถึงสูงสุด",
                value: formatTemperatureRange(growth.minimum_temperature, growth.maximum_temperature)
            }]
        },
        {
            title: "ดินและค่า",
            metrics: [
                { label: "ค่า pH", value: formatRange(growth.ph_minimum, growth.ph_maximum) },
                { label: "สารอาหารในดิน", score: growth.soil_nutriments },
                { label: "ความร่วนซุย / เนื้อดิน", score: growth.soil_texture }
            ]
        },
        {
            title: "ช่วงเวลา",
            metrics: [
                { label: "เดือนที่เจริญเติบโตดี", value: formatMonths(growth.growth_months) },
                { label: "เดือนที่ออกดอก", value: formatMonths(growth.bloom_months) }
            ]
        },
        {
            title: "คำแนะนำการปลูก",
            metrics: [
                { label: "การเพาะเมล็ด / ลงปลูก", value: growth.sowing },
                { label: "คำอธิบาย", value: growth.description }
            ]
        }
    ].map(section => ({
        ...section,
        metrics: section.metrics.filter(metric =>
            (hasValue(metric.score) && Number.isFinite(Number(metric.score))) ||
            hasValue(metric.value)
        )
    })).filter(section => section.metrics.length > 0);
}

export function getCareStatus(label, value) {
    const score = Number(value);

    if (label.includes("แสง")) {
        if (score >= 8) return { text: "แสงแดดปานกลาง-จัด", tip: "ต้องการแสงแดดโดยตรงในช่วงเช้า 4-6 ชั่วโมง เหมาะกับริมระเบียง" };
        if (score >= 5) return { text: "แสงรำไร", tip: "ชอบแสงแดดอ่อนๆ วางใกล้หน้าต่างที่แสงส่องถึง" };
        return { text: "แสงน้อย", tip: "อยู่รอดได้ในที่แสงน้อย ระวังอย่าให้โดนแดดจัดโดยตรง" };
    }

    if (label.includes("น้ำ") || label.includes("ความชื้น")) {
        if (score >= 8) return { text: "ต้องการน้ำมาก", tip: "รดน้ำทุกวัน หรือเมื่อผิวดินเริ่มแห้ง ชอบความชื้นสูง" };
        if (score >= 4) return { text: "ต้องการน้ำปานกลาง", tip: "รดน้ำสัปดาห์ละ 1-2 ครั้ง รอให้ผิวดินแห้งลึกลงไป 1-2 นิ้วค่อยรดซ้ำ" };
        return { text: "ต้องการน้ำน้อย", tip: "ทนแล้งได้ดี รดน้ำเมื่อดินแห้งสนิทเท่านั้น ระวังรากเน่า" };
    }

    if (label.includes("สารอาหาร") || label.includes("ดิน")) {
        if (score >= 7) return { text: "ต้องการสารอาหารสูง", tip: "ใช้ดินร่วนซุยที่อุดมสมบูรณ์ แนะนำให้ใส่ปุ๋ยทุกๆ 1-2 เดือน" };
        if (score >= 4) return { text: "สารอาหารปานกลาง", tip: "ใช้ดินร่วนโปร่ง (pH 7-7.5) ระบายน้ำดี แนะนำให้เติมปุ๋ยละลายช้าทุกๆ 3 เดือน" };
        return { text: "สารอาหารน้อย", tip: "ปลูกได้ในดินทั่วไป ไม่ต้องการปุ๋ยมาก" };
    }

    return { text: "ปานกลาง", tip: "ดูแลตามสภาพอากาศทั่วไป" };
}

export function getCareIcon(label) {
    if (label.includes("แสง")) return "☀️";
    if (label.includes("ความชื้นในดิน")) return "🪴";
    if (label.includes("น้ำ") || label.includes("ความชื้น")) return "💧";
    if (label.includes("ดิน") || label.includes("สารอาหาร")) return "🌱";
    return "🌿";
}
