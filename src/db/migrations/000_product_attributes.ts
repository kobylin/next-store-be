import { connect, disconnect } from "../index";
import { ProductAttribute, ProductAttributeCategory } from "../models";

(async () => {
  await connect();

  await ProductAttributeCategory.deleteMany({});
  await ProductAttribute.deleteMany({});

  const attributeCategories = [
    {
      key: "color",
      name: "Color",
      order: 0,
    },
    {
      key: "size",
      name: "Size",
      order: 1,
    },
    {
      key: "brand",
      name: "Brand",
      order: 2,
    },
    {
      key: "weight",
      name: "Weight",
      order: 3,
    },
    {
      key: "screen_size",
      name: "Screen Size",
      order: 4,
    },
    {
      key: "depth",
      name: "Depth",
      order: 5,
    },
  ];

  const attributeCategoriesMap = new Map<String, any>();

  for (let category of attributeCategories) {
    const categoryModel = new ProductAttributeCategory(category);
    await categoryModel.save();

    attributeCategoriesMap.set(categoryModel.key, categoryModel);
  }

  const productAttributes = [
    {
      categoryKey: "color",
      key: "blue",
      name: "Blue",
    },
    {
      categoryKey: "color",
      key: "red",
      name: "Red",
    },
    {
      categoryKey: "color",
      key: "brown",
      name: "Brown",
    },
    {
      categoryKey: "color",
      key: "white",
      name: "white",
    },
    {
      categoryKey: "color",
      key: "black",
      name: "black",
    },

    {
      categoryKey: "size",
      key: "xs",
      name: "XS",
    },
    {
      categoryKey: "size",
      key: "m",
      name: "M",
    },
    {
      categoryKey: "size",
      key: "l",
      name: "L",
    },
    {
      categoryKey: "size",
      key: "xl",
      name: "XL",
    },

    {
      categoryKey: "brand",
      key: "nike",
      name: "Nike",
    },
    {
      categoryKey: "brand",
      key: "Adidas",
      name: "Adidas",
    },
    {
      categoryKey: "brand",
      key: "ariston",
      name: "Ariston",
    },
    {
      categoryKey: "brand",
      key: "indesit",
      name: "Indesit",
    },
    {
      categoryKey: "brand",
      key: "lg",
      name: "LG",
    },
    {
      categoryKey: "brand",
      key: "samsung",
      name: "Samsung",
    },

    {
      categoryKey: "weight",
      key: "<20",
      name: "<20",
    },
    {
      categoryKey: "weight",
      key: "<30",
      name: "<30",
    },
    {
      categoryKey: "weight",
      key: "<50",
      name: "<50",
    },
    {
      categoryKey: "screen_size",
      key: "60*100",
      name: "60*100",
    },
    {
      categoryKey: "screen_size",
      key: "100*200",
      name: "100*200",
    },
    {
      categoryKey: "depth",
      key: "30",
      name: "30",
    },
    {
      categoryKey: "depth",
      key: "40",
      name: "40",
    },
    {
      categoryKey: "depth",
      key: "60",
      name: "60",
    },
  ];

  for (const { categoryKey, ...attribute } of productAttributes) {
    const attributeModel = new ProductAttribute({
      ...attribute,
      categoryId: attributeCategoriesMap.get(categoryKey)?.id,
    });

    await attributeModel.save();
  }

  await disconnect();
})();
