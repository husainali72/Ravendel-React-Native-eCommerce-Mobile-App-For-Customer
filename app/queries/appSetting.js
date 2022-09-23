import gql from 'graphql-tag';

const GET_APP_SETTING = gql`
query {
  getSettings {
    appearance {
      theme {
        primary_color
        logo
      }
      home {
        add_section_in_home {
          feature_product
          recently_added_products
          most_viewed_products
          recently_bought_products
          product_recommendation
          products_on_sales
          product_from_specific_categories
        }
      }
    }
  }
}
`;


export {GET_APP_SETTING};
