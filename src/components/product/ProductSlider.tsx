import { useRef, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';

import ProductDot from './ProductDot';

import { ImageProps } from '~/src/types/ProductProps';
const ProductSlider = ({
  images,
}: {
  images: {
    cursor: string;
    node: ImageProps;
  }[];
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageRef = useRef<PagerView>(null);
  return (
    <>
      <PagerView
        ref={pageRef}
        overScrollMode="auto"
        initialPage={0}
        onPageScroll={(e) => setCurrentPage(e.nativeEvent.position)}
        style={{ backgroundColor: 'white', aspectRatio: 3 / 2 }}>
        {images.map((image, index) => (
          <View style={{ width: '100%', height: '100%' }} key={index + 1}>
            <FastImage
              source={{
                uri: image.node.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        ))}
      </PagerView>
      <ProductDot nbItems={images.length || 0} activeItem={currentPage} />
    </>
  );
};

export default ProductSlider;
