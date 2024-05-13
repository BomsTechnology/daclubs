import { Button, ButtonProps } from 'tamagui';

const HeaderButton = (props: ButtonProps) => {
  return (
    <Button
      bg="#fff"
      unstyled
      w={50}
      borderWidth={1}
      borderColor="#EBEDF3"
      h={50}
      justifyContent="center"
      alignItems="center"
      {...props}>
      {props.children}
    </Button>
  );
};

export default HeaderButton;
