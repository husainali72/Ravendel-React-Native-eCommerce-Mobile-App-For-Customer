import gql from 'graphql-tag';

const ADD_TOCART = gql`
  mutation (
    $user_id: ID
    $total: Float
    $product_id: String
    $product_title: String
    $product_price: Float
    $product_image: String
    $qty: Int
    $tax_class: String
    $shipping_class: String
  ) {
    addToCart(
      user_id: $user_id
      total: $total
      product_id: $product_id
      product_title: $product_title
      product_price: $product_price
      product_image: $product_image
      qty: $qty
      tax_class: $tax_class
      shipping_class: $shipping_class
    ) {
      message
      success
    }
  }
`;
const ADD_CART = gql`
  mutation ($user_id: ID, $products: [cartProduct]) {
    addCart(user_id: $user_id, products: $products) {
      message
      success
    }
  }
`;
const GET_ORDERS = gql`
  {
    orders {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
    }
  }
`;

const GET_ORDER = gql`
  query ($id: ID!) {
    productCategory(id: $id) {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
    }
  }
`;

const DELETE_ORDER = gql`
  mutation ($id: ID!) {
    deleteOrder(id: $id) {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation (
    $id: ID!
    $billing: customObject
    $shipping: customObject
    $status: String
  ) {
    updateOrder(
      id: $id
      billing: $billing
      shipping: $shipping
      status: $status
    ) {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
    }
  }
`;
const DELETE_CART_PRODUCT = gql`
  mutation ($id: ID!, $product_id: ID!) {
    deleteCartProduct(id: $id, product_id: $product_id) {
      message
      success
    }
  }
`;

const GET_CART = gql`
  query ($id: ID!) {
    cartbyUser(user_id: $id) {
      id
      user_id
      status
      total
      products
      date
      updated
    }
  }
`;
const CART = gql`
  query ($id: ID!) {
    cart(id: $id) {
      id
      user_id
      status
      total
      products
      date
      updated
    }
  }
`;
const UPDATE_CART = gql`
  mutation ($id: ID!, $products: [cartProduct]) {
    updateCart(id: $id, products: $products) {
      message
      success
    }
  }
`;
const APPLY_COUPON = gql`
  query ($coupon_code: String, $cart: [cartProducts]) {
    calculateCoupon(coupon_code: $coupon_code, cart: $cart) {
      total_coupon
      message
    }
  }
`;
const ADD_CHECKOUT = gql`
  mutation ($user_id: ID, $products: [checkoutProduct]) {
    addCheckout(user_id: $user_id, products: $products) {
      id
      user_id
      shipping
      payment
      products
      status
      date
      updated
    }
  }
`;
const ORDER_HISTORY = gql`
  query ($user_id: ID!) {
    orderbyUser(user_id: $user_id) {
      data {
        id
        customer_id
        payment_status
        shipping_status
        coupon_code
        shipping
        billing
        products
        date
        subtotal
        shipping_amount
        tax_amount
        discount_amount
        grand_total
      }
      message {
        message
        success
      }
    }
  }
`;
const ADD_ORDER = gql`
  mutation (
    $customer_id: ID
    $billing: customObject
    $shipping: customObject
    $products: customArray
    $subtotal: String
    $shipping_amount: String
    $tax_amount: String
    $discount_amount: String
    $grand_total: String
    $coupon_code: String
  ) {
    addOrder(
      customer_id: $customer_id
      shipping: $shipping
      billing: $billing
      products: $products
      subtotal: $subtotal
      shipping_amount: $shipping_amount
      tax_amount: $tax_amount
      discount_amount: $discount_amount
      grand_total: $grand_total
      coupon_code: $coupon_code
    ) {
      message
      success
    }
  }
`;
export {
  ADD_TOCART,
  ADD_CART,
  GET_ORDERS,
  GET_ORDER,
  DELETE_ORDER,
  UPDATE_ORDER,
  DELETE_CART_PRODUCT,
  GET_CART,
  UPDATE_CART,
  APPLY_COUPON,
  ADD_CHECKOUT,
  ORDER_HISTORY,
  ADD_ORDER,
  CART,
};
