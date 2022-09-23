import gql from 'graphql-tag';

const GET_APP_SETTING = gql`
  {
    getSettings {
      appearance {
        theme {
          primary_color
          logo
        }
      }
    }
  }
`;

export {GET_APP_SETTING};
