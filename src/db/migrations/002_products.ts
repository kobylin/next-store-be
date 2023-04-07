import { connect, disconnect } from "../index";
import {
  Product,
  ProductAttribute,
  ProductAttributeCategory,
  ProductCategory,
} from "../models";
import * as productsData from "./data/products";
import { random } from "lodash";

const parsePrice = (price: String) => {
  return parseFloat(price.replace(/\s+/, ""));
};
const parseBootBrand = (string: String) => {
  const match = /(.+)•/.exec(string);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
};

const washingMachineBrands = [
  "whirlpool",
  "electrolux",
  "samsung",
  "lg",
  "beko",
  "indesit",
  "gorenje",
  "artel",
  "bosch",
  "candy",
  "ardesto",
  "milano",
  "technics",
  "miele",
  "midea",
  "skyworth",
  "toshiba",
  "hansa",
  "zanussi",
  "aeg",
  "supretto",
  "vivax",
  "ariston",
  "edler",
  "saturn",
  "grifon",
];

const tvBrands = [
  "samsung",
  "lg",
  "philips",
  "akai",
  "ergo",
  "hisense",
  "blaupunkt",
  "nokia",
  "vivax",
  "sony",
  "gazer",
  "sharp",
  "xiaomi",
  "skyworth",
  "realme",
  "mystery",
  "kivi",
  "setup",
  "hoffson",
  "satelit",
  "haier",
];

const extractBrandFromString = (brands: String[], string: String) => {
  const match = new RegExp(`(${brands.join("|")})`, "i").exec(string);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const createAttributeIdGetter = async (categoryKey: String) => {
  let brandCategory = await ProductAttributeCategory.findOne({
    key: categoryKey,
  });

  const allBrands = await ProductAttribute.find({
    categoryId: brandCategory.id,
  });

  const brandsMap = [...allBrands].reduce((acc, b) => {
    acc.set(b.key, b);
    return acc;
  }, new Map<string, any>());

  return async (brand) => {
    if (brandsMap.get(brand)) {
      return brandsMap.get(brand).id;
    }

    const brandAttribute = await new ProductAttribute({
      categoryId: brandCategory.id,
      key: brand,
      name: brand,
    }).save();

    brandsMap.set(brand, brandAttribute);
    return brandAttribute.id;
  };
};

const extractBrands = (titles: String[]) => {
  const allWords = [];

  titles.forEach((t) => {
    allWords.push(...t.split(" ").map((w) => w.trim()));
  });

  const filtered = allWords.filter((w) => /^[a-z]+$/i.test(w));

  const counted = filtered.reduce((acc, w) => {
    if (acc[w] === undefined) {
      acc[w] = 0;
    }
    acc[w]++;

    return acc;
  }, {});

  const sorted = Object.entries(counted).sort((a, b) => (a[1] < b[1] ? 1 : -1));

  console.log("sorted", sorted);

  sorted.forEach((s) => {
    console.log(s[0]);
  });
};

const createRandomAttributePicker = async (attributeCategoryKey: String) => {
  const attributes = [
    ...(await ProductAttribute.find({
      categoryId: (
        await ProductAttributeCategory.findOne({
          key: attributeCategoryKey,
        })
      )?.id,
    })),
  ];

  return () => {
    return attributes[random(attributes.length - 1)];
  };
};

(async () => {
  await connect();

  await Product.deleteMany({});

  const categories = await ProductCategory.find({});
  const categoriesMap = [...categories].reduce((acc, category) => {
    acc.set(category.key, category);
    return acc;
  }, new Map<string, any>());

  const getRandomSize = await createRandomAttributePicker("size");
  const getRandomColor = await createRandomAttributePicker("color");
  const getRandomDepth = await createRandomAttributePicker("depth");
  const getRandomScreenSize = await createRandomAttributePicker("screen_size");
  const getRandomWeight = await createRandomAttributePicker("weight");

  const getBrandId = await createAttributeIdGetter("brand");

  for (const product of productsData.TV) {
    const brand = extractBrandFromString(tvBrands, product.title);
    if (brand === null) {
      console.log("missed brand", product.title);
      continue;
    }

    const brandId = await getBrandId(brand);

    const preparedProduct = {
      title: product.title,
      imageUrl: product.imageUrl,
      description: "",
      rating: Math.round(Math.random() * 5),
      price: parsePrice(product.price),
      categories: [categoriesMap.get("tv")?.id],
      attributes: [brandId, getRandomScreenSize().id],
    };

    await new Product(preparedProduct).save();
  }

  for (const product of productsData.washingMachines) {
    const brand = extractBrandFromString(washingMachineBrands, product.title);
    if (brand === null) {
      console.log("missed brand", product.title);
      continue;
    }
    const brandId = await getBrandId(brand);

    const preparedProduct = {
      title: product.title,
      imageUrl: product.imageUrl,
      description: "",
      rating: Math.round(Math.random() * 5),
      price: parsePrice(product.price),
      categories: [categoriesMap.get("washingMachine")?.id],
      attributes: [brandId, getRandomDepth().id, getRandomWeight().id],
    };

    await new Product(preparedProduct).save();
  }

  for (const product of productsData.snickers) {
    const brand = parseBootBrand(product.title);
    const brandId = await getBrandId(brand);

    const preparedProduct = {
      title: product.title,
      imageUrl: product.imageUrl,
      description: "",
      rating: Math.round(Math.random() * 5),
      price: parsePrice(product.price),
      categories: [categoriesMap.get("snickers")?.id],
      attributes: [brandId, getRandomColor().id, getRandomSize().id],
    };

    await new Product(preparedProduct).save();
  }

  for (const product of productsData.boots) {
    const brand = parseBootBrand(product.title);
    const brandId = await getBrandId(brand);

    const preparedProduct = {
      title: product.title,
      imageUrl: product.imageUrl,
      description: "",
      rating: Math.round(Math.random() * 5),
      price: parsePrice(product.price),
      categories: [categoriesMap.get("boots")?.id],
      attributes: [brandId, getRandomColor().id, getRandomSize().id],
    };

    await new Product(preparedProduct).save();
  }

  await disconnect();
})();
