import { rebuildInventory } from "./lib/cars/inventory";
import { closeBrowser } from "./lib/cars/http";

console.log("⏳ Запускаю полный парсинг каталога...\n");
console.log("Это займёт ~10-30 минут в зависимости от количества машин.\n");

rebuildInventory()
    .then((result) => {
        console.log(`\n✅ Спарсено: ${result.totalCars} машин`);
        console.log(`📁 Сохранено в data/cars-inventory.json`);
    })
    .catch((err) => {
        console.error("❌ Ошибка:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await closeBrowser();
    });