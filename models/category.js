const categories = [
  { id: "1", name: "Phone", decription: "Phone category products" },
  { id: "2", name: "Computer", decription: "Computer category products" },
  { id: "3", name: "Appliances", decription: "Appliances category products" },
];

module.exports = class Category {
  constructor(name, description) {
    this.id = (categories[categories.length - 1].id + 1).toString();
    this.name = name;
    this.description = description;
  }

  saveCategory() {
    categories.push(this);
  }

  static getAllCategories() {
    return categories;
  }

  static getCategoryById(id) {
    return categories.find((cat) => cat.id === id);
  }

  static updateCategory(category) {
    const index = products.findIndex((data) => data.id === category.id);
    if (index > -1) {
      categories[index] = category;
    }
  }
};
