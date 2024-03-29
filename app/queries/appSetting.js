import gql from 'graphql-tag';

const GET_APP_SETTING = gql`
  query HomePageSettings {
    getSettings {
      seo {
        meta_title
        meta_tag
        meta_description
      }
      imageStorage {
        status
        s3_id
        s3_key
      }
      store {
        currency_options {
          currency
          currency_position
          thousand_separator
          decimal_separator
          number_of_decimals
        }
        store_address {
          city
          country
          state
          zip
        }
        measurements {
          weight_unit
          dimensions_unit
        }
        inventory {
          manage_stock
          notifications {
            show_out_of_stock
            alert_for_minimum_stock
          }
          notification_recipients
          low_stock_threshold
          out_of_stock_threshold
          out_of_stock_visibility
          stock_display_format
        }
      }
      paymnet {
        cash_on_delivery {
          enable
          title
          description
          instructions
        }
        bank_transfer {
          enable
          title
          description
          instructions
          account_details {
            account_name
            account_number
            bank_name
            short_code
            iban
            bic_swift
          }
        }
        stripe {
          enable
          title
          description
          inline_credit_card_form
          statement_descriptor
          capture
          test_mode
          publishable_key
          secret_key
          webhook_key
        }
        paypal {
          enable
          title
          description
          paypal_email
          ipn_email_notification
          receiver_email
          paypal_identity_token
          invoice_prefix
          test_mode
          api_username
          api_password
          api_signature
        }
      }
      appearance {
        home {
          slider {
            image
            link
            open_in_tab
          }
          add_section_in_home {
            feature_product
            recently_added_products
            most_viewed_products
            recently_bought_products
            product_recommendation
            products_on_sales
            product_from_specific_categories
          }
          add_section_web {
            label
            name
            visible
            category
          }
        }
        theme {
          primary_color
          logo
        }
        mobile {
          slider {
            image
            link
            open_in_tab
          }
          mobile_section {
            label
            section_img
            visible
            url
            category
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export { GET_APP_SETTING };
