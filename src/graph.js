// # แผนภาพทิศทางของหน้าต่าง ๆ ที่กำหนดไว้ใน React Router
// # แต่ละเส้นเชื่อมแทนลิงก์หรือการย้อนกลับที่มีอยู่ในคอมโพเนนต์
export const pageGraph = {
    home: ["favorites", "history", "detail"],
    favorites: ["home", "history", "detail"],
    history: ["home", "favorites", "detail"],
    detail: ["home", "history", "favorites"],
};

// # จับคู่ชื่อหน้าในกราฟกับ URL ที่ใช้เปิดหน้านั้น
export const pagePaths = {
    home: "/",
    favorites: "/favorites.html",
    history: "/history.html",
    detail: "/plantDetail.html",
};

// # ตรวจสอบด้วย BFS ว่าสามารถเดินทางจากหน้าเริ่มต้นไปยังหน้าปลายทางได้หรือไม่
export function canReach(start, end, graph = pageGraph) {
    // # คิวแบบ FIFO ใช้เก็บหน้าที่รอตรวจ และ Set ป้องกันการวนซ้ำ
    const queue = [start];
    const visited = new Set([start]);

    while (queue.length > 0) {
        // # นำหน้าถัดไปออกจากคิว และจบเมื่อพบหน้าปลายทาง
        const current = queue.shift();
        if (current === end) return true;

        // # เพิ่มหน้าข้างเคียงที่ยังไม่เคยตรวจลงในคิว
        for (const neighbor of graph[current] ?? []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    // # ตรวจครบทุกหน้าที่เข้าถึงได้แล้ว แต่ยังไม่พบปลายทาง
    return false;
}

// # สรุปหน้าที่ไปไม่ถึงจากหน้าแรก และหน้าที่ไม่มีทางกลับหน้าแรก
export function checkGraph() {
    const pages = Object.keys(pageGraph);
    return {
        orphans: pages.filter(page => !canReach("home", page)),
        deadEnds: pages.filter(page => !canReach(page, "home")),
    };
}
