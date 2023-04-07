import { connect, disconnect } from "../index";
import { ProductCategory } from "../models";

(async () => {
  await connect();

  await ProductCategory.deleteMany({});

  const shoesCategory = new ProductCategory({
    key: "shoes",
    name: "Shoes",
  });
  await shoesCategory.save();

  await new ProductCategory({
    key: "snickers",
    name: "Snickers",
    parentId: shoesCategory.id,
  }).save();

  await new ProductCategory({
    key: "boots",
    name: "Boots",
    parentId: shoesCategory.id,
  }).save();

  const houseHoldEquipmentCategory = new ProductCategory({
    key: "household",
    name: "Household Equipment",
  });
  await houseHoldEquipmentCategory.save();

  await new ProductCategory({
    key: "washingMachine",
    name: "Washing Machine",
    parentId: houseHoldEquipmentCategory.id,
  }).save();

  await new ProductCategory({
    key: "tv",
    name: "TV",
    parentId: houseHoldEquipmentCategory.id,
  }).save();

  await disconnect();
})();
