import gql from "graphql-tag";
const GET_USERS = gql`
  {
    users {
      id
      name
      email
      role
      image
    }
  }
`;

const GET_USER = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
    }
  }
`;

const ADD_USER = gql`
  mutation(
    $name: String
    $email: String
    $password: String
    $role: String
    $image: Upload
  ) {
    addUser(
      name: $name
      email: $email
      password: $password
      role: $role
      image: $image
    ) {
      name
      email
      role
      id
      image
    }
  }
`;

const UPDATE_USER = gql`
  mutation(
    $id: ID!
    $name: String
    $email: String
    $password: String
    $role: String
    $updatedImage: Upload
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      password: $password
      role: $role
      updatedImage: $updatedImage
    ) {
      name
      email
      role
      id
      image
    }
  }
`;

const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      name
      email
      role
      id
      image
    }
  }
`;
const ADD_CUSTOMER = gql`
mutation (
     $first_name: String,
     $last_name: String, 
     $email: String,
     $phone: String,
     $password: String
      ) {
  addCustomer(
    first_name: $first_name
    last_name: $last_name
    email: $email
    phone: $phone
    password: $password
  ) {
    message
    success
    __typename
  }
}

`;
const EDIT_CUSTOMER = gql`
mutation (
      $id: ID!
      $first_name: String,
      $last_name: String, 
      $email: String,
      $phone: String,
      $gender:String
    ) {
  updateCustomer(
    id: $id
    first_name: $first_name
    last_name: $last_name
    email: $email
    phone: $phone
    gender:$gender
  ) {
    message
    success
     }
   }
`;
const CHANGE_PASSWORD = gql`
  mutation(
    $id: ID!,
    $oldPassword: String, 
    $newPassword: String) {
    updateCustomerPassword(
      id: $id, 
      oldPassword: $oldPassword,
      newPassword: $newPassword) {
      message
      success
    }
  }
`;

export { GET_USERS, GET_USER, ADD_USER, UPDATE_USER, DELETE_USER,ADD_CUSTOMER,EDIT_CUSTOMER,CHANGE_PASSWORD };
