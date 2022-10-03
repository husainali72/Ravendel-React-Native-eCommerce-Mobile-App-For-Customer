import AsyncStorage from '@react-native-async-storage/async-storage';

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

/*let baseURL = "";
if (process.env.NODE_ENV === "production") {
  baseURL = "http://159.89.170.199:80";
} else {
  baseURL = "http://localhost:8000";
}*/

//export const baseUrl = "http://159.89.170.199";
// export const baseUrl = 'http://localhost:8000';
export const baseUrl = 'https://ravendel-backend.hbwebsol.com';

/*-------------------------------------------------------------------------------------------------------------------------------------- */
//simple category array to Tree array
export const unflatten = (items, id = null, link = 'parentId') => {
  const arr = items.filter(item => item[link] === id)
    .map(item => ({ ...item, children: unflatten(items, item.id) }));
  return arr
  // var tree = [],
  //     mappedArr = {},
  //     arrElem,
  //     mappedElem;

  // // First map the nodes of the array to an object -> create a hash table.
  // for(var i = 0, len = arr.length; i < len; i++) {
  //   arrElem = arr[i];
  //   mappedArr[arrElem.id] = arrElem;
  //   mappedArr[arrElem.id]['children'] = [];
  // }
  // for (var id in mappedArr) {
  //   if (mappedArr.hasOwnProperty(id)) {
  //     mappedElem = mappedArr[id];
  //     // If the element is not at the root level, add it to its parent array of children.
  //     if (mappedElem.parentId) {
  //       // mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
  //     }
  //     // If the element is at the root level, add it to first level elements array.
  //     else {
  //       tree.push(mappedElem);
  //     }
  //   }


}

/*----------------------------------------------------------------------------------------------------------------------------------------- */
//print tree array with html
// export var categoriesPrint = "";
// export const printTree = tree => {
//   categoriesPrint += "<ul>";

//   for (let i in tree) {
//     categoriesPrint += "<li>" + tree[i].name;
//     if (tree[i].children && tree[i].children.length) {
//       printTree(tree[i].children);
//     }
//     categoriesPrint += "</li>";
//   }

//   categoriesPrint += "</ul>";
// };

export var categoriesPrint = '';
export const printTree = tree => {
  categoriesPrint += "<ul className='category-dropdown'>";

  for (let i in tree) {
    categoriesPrint += `<li className="${tree[i].children && tree[i].children.length ? 'has-submenu' : ''
      }">                               
                        <label for="${tree[i].name
      }" className="checkmark-container">${tree[i].name}
                          <input type='checkbox' name="abc" id="${tree[i].name
      }">
                          <span className="checkmark"></span>
                        </label>`;
    if (tree[i].children && tree[i].children.length) {
      printTree(tree[i].children);
    }
    categoriesPrint += '</li>';
  }

  categoriesPrint += '</ul>';
};


export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token
};

export const getValue = async (key) => {
  var data = '';
  try {
    const storageToken = await AsyncStorage.getItem(key);
    if (storageToken !== null) {
      data = storageToken;
    }
  } catch (e) {
    // Error
  }
  return data;
};

export const checkUserLoginStorage = async () => {
  const token = await AsyncStorage.getItem('token');
  const userDetails = await AsyncStorage.getItem('userDetails');

  return {
    token,
    userDetails: JSON.parse(userDetails),
  };
};
