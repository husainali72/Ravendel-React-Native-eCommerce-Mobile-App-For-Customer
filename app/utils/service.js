import jumpTo from './navigation';
import axios from 'axios';
import {isEmpty} from './helper';
import APclient from '../Client';

export const mutation = async (query, variables) => {
  try {
    const response = await APclient.mutate({
      mutation: query,
      variables,
    });
    return Promise.resolve(response);
  } catch (error) {
    const errors = JSON.parse(JSON.stringify(error));
    console.log(errors);
    if (
      errors.graphQLErrors.length &&
      !isEmpty(errors.graphQLErrors[0].message)
    ) {
      return Promise.reject(errors.graphQLErrors[0].message);
    }
    if (
      !isEmpty(errors.networkError) &&
      errors.networkError.statusCode === 400
    ) {
      return Promise.reject(errors.message);
    }
    return Promise.reject('Something went wrong');
  }
};

export const query = async (query, variables) => {
  try {
    const response = await APclient.query({
      query: query,
      variables,
    });
    return Promise.resolve(response);
  } catch (error) {
    const errors = JSON.parse(JSON.stringify(error));
    console.log('Error', errors);
    if (
      errors.graphQLErrors.length &&
      !isEmpty(errors.graphQLErrors[0].message)
    ) {
      return Promise.reject(errors.graphQLErrors[0].message);
    }
    if (
      !isEmpty(errors.networkError) &&
      errors.networkError.statusCode === 400
    ) {
      return Promise.reject(errors.message);
    }
    return Promise.reject('Something went wrong');
  }
};

export const login = (email, password) => {
  const body = {
    email: email,
    password: password,
  };
  return service({
    method: 'POST',
    url: 'api/users/login',
    data: body,
  }).then(res => {
    Auth.setUserToken(res.data);
    return res;
  });
};
