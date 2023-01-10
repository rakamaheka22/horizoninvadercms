'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

function generateDataResponse({ attributes }) {
    const {
      price,
      discount: discountPrice,
      image: images,
      categories: cat,
      ...allAttributes
    } = attributes
  
    const discount = price - (price * discountPrice);

    const categories = cat?.data?.map((el) => el?.attributes?.slug ) || [];

    const image = images?.data?.map((el) => {
        return {
            url: el?.attributes?.url || '',
            alt: el?.attributes?.alternativeText || el?.attributes?.name,
            width: el?.attributes?.width || 0,
            height: el?.attributes?.height || 0
        }
    }) || [];
  
    return {
      ...allAttributes,
      price,
      discount,
      categories,
      image,
    }
  }
  
  module.exports = createCoreController('api::product.product',
    ({ strapi }) => ({
      async find(ctx, _next) {
        try {
          const { data, meta } = await super.find(ctx);
          const modifiedData = data.map(generateDataResponse);
  
          return { data: modifiedData, meta };
        } catch (error) {
          console.error(error);
          return { data: null, error };
        }
      },
      getByCategory: async (ctx, _next) => {
        const { category, start = 0, limit = 12 } = ctx.params;
  
        const entries = await strapi.entityService.findMany('api::product.product', {
          filters: {
            categories: {
                slug: {
                    $contains: category,
                },
            },
          },
          sort: [{ id: 'desc' }],
          populate: {
            image: '*',
            categories: {
              populate: '*'
            },
            links: {
              populate: '*'
            }
          },
          start,
          limit,
        });
  
        return {
            data: entries.map((item) => {
                const discount = item.price - (item.price * item.discount);

                const categories = item.categories?.map((el) => el?.slug ) || [];

                const image = item.image?.map((el) => {
                    return {
                        url: el?.url || '',
                        alt: el?.alternativeText || el?.name,
                        width: el?.width || 0,
                        height: el?.height || 0
                    }
                }) || [];

                return {
                  ...item,
                  discount,
                  categories,
                  image
                }
            })
        }
      },
      getBySlug: async (ctx, _next) => {
        const { slug } = ctx.params;
  
        const entries = await strapi.entityService.findMany('api::product.product', {
          filters: {
            slug: {
                $eqi: slug,
            },
          },
          populate: {
            image: '*',
            categories: {
              populate: '*'
            },
            links: {
              populate: '*'
            }
          }
        });
  
        if (entries.length === 0) {
            return { 
                data: null
            }
        }

        return {
            data: entries.map((item) => {
                const discount = item.price - (item.price * item.discount);

                const categories = item.categories?.map((el) => el?.slug ) || [];

                const image = item.image?.map((el) => {
                    return {
                        url: el?.url || '',
                        alt: el?.alternativeText || el?.name,
                        width: el?.width || 0,
                        height: el?.height || 0
                    }
                }) || [];

                return {
                  ...item,
                  discount,
                  categories,
                  image
                }
            })
        }
      },
  }));
