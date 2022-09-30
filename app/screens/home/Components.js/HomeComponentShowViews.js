import React from 'react';
import {
    AText,
    ARow,
} from '../../../theme-components';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import URL from '../../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../../utils/helper';


const HomeComponentShowViews = ({ dataItems, navigatetonext }) => {

    const CategoryShowView = React.memo(() => {
        return (
            <ARow wrap row>
                {!isEmpty(dataItems) &&
                    <FlatList
                        data={dataItems}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={ProductCard}
                    />
                }
            </ARow>
        )
    }, [])

    const ProductCard = ({ item }) => {
        return (
            <Card  onPress={() => {navigatetonext(item)}}>
                <CardImageWrapper>
                    {item.feature_image ? (
                        <>
                            <FastImage
                                style={{ width: '100%', height: '100%', }}
                                source={{
                                    uri: URL + item.feature_image.medium,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </>
                    ) : (
                        <CardNotImage
                            source={{
                                uri:
                                    'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                            }}
                        />
                    )}
                </CardImageWrapper>
                <CardBody>
                    <AText>
                        {item.pricing.sellprice<item.pricing.price ? (
                            <AText heavy small color="#DB3022">
                                ${item.pricing.sellprice.toFixed(2)}{'  '}
                            </AText>
                        ) : null}
                        <AText small
                            lineThrough={item.pricing.sellprice<item.pricing.price ? true : false}
                            medium={item.pricing.sellprice<item.pricing.price ? false : true}
                            heavy={item.pricing.sellprice<item.pricing.price ? false : true}
                            color={item.pricing.sellprice<item.pricing.price ? '#7b7b7b' : '#000000'}>
                            ${item.pricing.price.toFixed(0)}
                        </AText>

                    </AText>
                    <AText small bold color="#000">
                        {item.name.length > 20
                            ? item.name.substring(0, 20) + '...'
                            : item.name}
                    </AText>
                </CardBody>
            </Card>)
  
    }
    return (
        <>

            <CategoryShowView />

        </>
    );
};
const Card = styled.TouchableOpacity`
  width:200px;
  margin:10px;
  background: #fff;
  padding: 5px;
  border-radius: 10px;
  shadow-color: #000;
shadow-offset: {
	width: 0;
	height: 2;
},
shadow-opacity: 0.25px;
shadow-radius: 3.84px;
elevation: 5;
`;

const CardImageWrapper = styled.View`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
`;

const CardImage = styled.Image`
  flex: 1;
  resize-mode: cover;
`;

const CardNotImage = styled.Image`
  flex: 1;
  resize-mode: contain;
`;

const CardBody = styled.View`
  padding: 15px 5px;
`;



export default HomeComponentShowViews;
