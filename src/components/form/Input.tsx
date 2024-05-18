import { Control, Controller } from 'react-hook-form';
import { Input as TamaguiInput, InputProps, SizableText } from 'tamagui';

type CustomInputProps = InputProps & {
  rules?: object;
  name?: string;
  control?: Control;
};

const Input = (props: CustomInputProps) => {
  return (
    <Controller
      name={props.name!}
      control={props.control}
      rules={props.rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <>
          <TamaguiInput
            {...props}
            borderRadius={0}
            borderWidth={1}
            borderColor={error ? '$red10' : '$gray6'}
            fontWeight="500"
            bg="#fff"
            fontSize={14}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
          {error && (
            <SizableText numberOfLines={1} color="$red10" fontWeight="300" fontSize={12}>
              {error.message || 'Champs invalide'}
            </SizableText>
          )}
        </>
      )}
    />
  );
};

export default Input;
