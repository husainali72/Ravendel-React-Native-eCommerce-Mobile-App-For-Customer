import { gql, useQuery } from '@apollo/client';


const GET_PRODUCTS = gql`
query  {
products {
    data {
      _id
      name
      categoryId {
        id
        name
      }
      url
      sku
      description
      quantity
      pricing
      feature_image
      gallery_image
      meta
      shipping
      tax_class
      status
      featured_product
      product_type
      custom_field
      date
      updated
      short_description
    }
  }
}
`;

const GET_PRODUCT = gql`
query ($id:ID!) {
  product(id: $id) {
    data {
      _id
      name
      url
      sku
      description
      quantity
      pricing
      feature_image
      gallery_image
      meta
      shipping
      tax_class
      status
      featured_product
      product_type
      custom_field
      date
      updated
      categoryId {
        id
        name
  
      }
      short_description
      variant

    }
  }
}
`;

const GET_CATEGORIES = gql`
query {
  productCategories {
    data {
            id
            name
            parentId
            date
            updated
            url
           image
    }
  }
  }
`;

const GET_ALL_CATEGORIES = gql`
  query($fillter: customObject) {
    productCategoriesByFilter(filter: $fillter) {
      id
      name
      parentId
      url
      description
      image
      child_cat {
        id
        name
        parentId
      }
      meta
      date
      updated
    }
  }
`;

const GET_CAT_PRODUCTS = gql`
  query($url: String!) {
    productsbycaturl(cat_url: $url) {
      data {
      id
      name
      parentId
      url
      description
      image
      meta
      date
      updated
      products {
        _id
        name
        url
        sku
        description
        quantity
        pricing
        feature_image
        gallery_image
        meta
        shipping
        tax_class
        status
        featured_product
        product_type
        custom_field
        date
        updated
        categoryId {
          id
          name
        }
      }
    }
  }
  }
`;

const GET_PRODUCT_REVIEWS = gql`
  query($product_id: ID!) {
    productwisereview(product_id: $product_id) {
      data {
        title
        customer_id {
          id
          first_name
        }
        email
        review
        rating
        date
        updated
        status
      }
    }
  }
`;

const ADD_REVIEW = gql`
  mutation(
    $title: String
    $customer_id: String
    $product_id: String
    $email: String
    $review: String
    $rating: String
    $status: String
  ) {
    addReview(
      title: $title
      customer_id: $customer_id
      product_id: $product_id
      email: $email
      review: $review
      rating: $rating
      status: $status
    ) {
      message
      success
    }
  }
`;

const SALE_PRODUCT=gql`
query{
  onSaleProducts {
    _id
    name
    feature_image
    pricing
    url
    categoryId {
      id
      name
    }
    quantity
    featured_product
    status
    variant
  }
}
`;

const RECENT_PRODUCT =gql`
query{
  recentproducts {
    _id
    name
    feature_image
    pricing
    url
    categoryId {
      id
      name
    }
    quantity
    featured_product
    status
    variant
  }
}

`;

const PRODUCT_BY_A_CATEGORY= gql`
query ($id: ID!) {
  productsbycatid(cat_id: $id) {
    _id
    name
    feature_image
    pricing
    url
    categoryId {
      id
      name
    }
    quantity
    featured_product
    status
    variant
  }
}
`;
const FEATURE_CATEGORY= gql`
query{
  featureproducts {
    _id
    name
    feature_image
    pricing
    url
    categoryId {
      id
      name
    }
    quantity
    featured_product
    status
    variant
  }
}

`;

export {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_PRODUCT,
  GET_CAT_PRODUCTS,
  GET_PRODUCT_REVIEWS,
  ADD_REVIEW,
  GET_ALL_CATEGORIES,
  SALE_PRODUCT,
  RECENT_PRODUCT,
  PRODUCT_BY_A_CATEGORY,
  FEATURE_CATEGORY
};
