module.exports = {
    routes: [
      {
        method: "GET",
        path: "/product/category/:category/:start/:limit",
        handler: "product.getByCategory"
      },
      {
        method: "GET",
        path: "/product/:slug",
        handler: "product.getBySlug"
      },
    ]
}
  