import React, { useEffect, useState } from 'react';
import { AText } from '../../theme-components';
import styled from 'styled-components/native';
import URL from '../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const ProductPriceText = ({
  Pricing,
  fontsizesmall,
  DontshowPercentage,
  showInMulipleLine,
  fontColor,
}) => {
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );

  return (
    <ProductPriceView fd={showInMulipleLine ? showInMulipleLine : 'row'}>
      {Pricing.sellprice && Pricing.sellprice < Pricing.price ? (
        <>
          <AText
            large={!isEmpty(fontsizesmall) ? !fontsizesmall : true}
            color={!isEmpty(fontColor) ? fontColor : '#3a3a3a'}
            heavy>
            {formatCurrency(Pricing.sellprice, currencyOptions, currencySymbol)}
            {'  '}
          </AText>
        </>
      ) : null}
      {/* ===============Has Sale Price============= */}
      <AText
        lineThrough={Pricing.sellprice < Pricing.price ? true : false}
        large={
          Pricing.sellprice < Pricing.price
            ? false
            : !isEmpty(fontsizesmall)
            ? !fontsizesmall
            : true
        }
        heavy={Pricing.sellprice < Pricing.price ? false : true}
        color={Pricing.sellprice < Pricing.price ? '#7b7b7b' : '#000000'}>
        {formatCurrency(Pricing.price, currencyOptions, currencySymbol)}
      </AText>
      {(isEmpty(DontshowPercentage) || !DontshowPercentage) &&
      Pricing.sellprice < Pricing.price ? (
        <>
          {/* ===============Has Discount Price============= */}
          {!isEmpty(Pricing.sellprice) && !isEmpty(Pricing.price) && (
            <AText small heavy color="#DB3022">
              {'  '}(
              {Math.round(
                (100 / Pricing.price) * (Pricing.price - Pricing.sellprice),
              )}
              % off)
            </AText>
          )}
        </>
      ) : null}
    </ProductPriceView>
  );
};
const styles = StyleSheet.create({
  productImage: { flex: 1, resizeMode: 'cover' },
});

const ProductPriceView = styled.View`
  flex-direction: ${(props) => props.fd ?? 'row'};
  align-items: center;
`;

export default ProductPriceText;
