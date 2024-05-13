import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useAtom } from 'jotai';
import { View } from 'react-native';

import ProductCard from '~/src/components/card/ProductCard';
import CustomHeader from '~/src/components/header/CustomHeader';
import EmptyScreen from '~/src/components/screen/EmptyScreen';
import useShowNotification from '~/src/hooks/useShowNotification';
import { MainProductProps } from '~/src/types/ProductProps';
import { wishlistWithStorage } from '~/src/utils/storage';
import { Container } from '~/tamagui.config';

const Page = () => {
  const { showMessage } = useShowNotification();
  const [wishlist, setWishlist] = useAtom(wishlistWithStorage);

  const setWishlistItem = (data: MainProductProps) => {
    const index = wishlist.indexOf(data);
    if (index > -1) {
      setWishlist(wishlist.filter((wishlist) => wishlist.id !== data.id));
      showMessage('Supprimé des favoris', 'success');
    } else {
      setWishlist([...wishlist, data]);
      showMessage('Ajouté aux favoris', 'success');
    }
  };
  return (
    <>
      <CustomHeader
        title="Favoris"
        description={`(${wishlist.length} Produit${wishlist.length > 1 ? 's' : ''})`}
        icon={<Ionicons name="heart" size={20} color="black" />}
      />
      {wishlist.length > 0 ? (
        <Container>
          <FlashList
            data={wishlist}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ProductCard
                setWishlist={() => setWishlistItem(item)}
                isFavorite={wishlist.some((prod) => prod.id === item.id)}
                from="(app)/(shop)/favorite"
                {...item}
                peer={(index + 1) % 2 === 0}
              />
            )}
            estimatedItemSize={500}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </Container>
      ) : (
        <EmptyScreen message="Aucun produit favoris" />
      )}
    </>
  );
};

export default Page;
