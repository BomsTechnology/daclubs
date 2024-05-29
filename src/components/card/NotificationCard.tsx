import { Circle, H6, Paragraph, XStack, YStack } from 'tamagui';

import NotificationProps from '~/src/types/NotificationProps';

const NotificationCard = ({ ...props }: NotificationProps) => {
  return (
    <XStack borderBottomWidth={3} borderColor="#EEF1F4" p={15} alignItems="flex-start" gap={10}>
      <Circle mt={10} size={10} backgroundColor={props.read ? '#EEF1F4' : '#38A61D'} />
      <YStack>
        <H6 fontWeight="600">{props.title}</H6>
        <Paragraph color="#4C4C4C">{props.message}</Paragraph>
      </YStack>
    </XStack>
  );
};

export default NotificationCard;
