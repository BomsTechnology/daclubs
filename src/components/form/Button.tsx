import { Button as TamaguiButton, ButtonProps, Spinner, SizableText } from 'tamagui';

type CustomButtomProps = ButtonProps & {
  loading?: boolean;
  customIcon?: JSX.Element;
};

const Button = (props: CustomButtomProps) => {
  return (
    <TamaguiButton bg="#000" borderRadius={0} {...props}>
      {props.loading && props.loading === true ? (
        <Spinner color="#fff" />
      ) : (
        <>
          {props.customIcon}
          <SizableText fontWeight="700" color="#fff">
            {props.children}
          </SizableText>
        </>
      )}
    </TamaguiButton>
  );
};

export default Button;
