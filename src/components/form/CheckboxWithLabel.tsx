import { Ionicons } from '@expo/vector-icons';
import type { CheckboxProps } from 'tamagui';
import { Checkbox, Label, XStack } from 'tamagui';

type CheckboxWithLabelProps = CheckboxProps & {
  label?: string;
};

const CheckboxWithLabel = ({
  label = 'Accept terms and conditions',
  ...checkboxProps
}: CheckboxWithLabelProps) => {
  const id = `checkbox-filter-${label}`;
  return (
    <XStack alignItems="center" space="$2">
      <Checkbox id={id} size="$4" {...checkboxProps}>
        <Checkbox.Indicator>
          <Ionicons name="checkmark" size={12} />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size="$4" htmlFor={id} numberOfLines={1}>
        {label}
      </Label>
    </XStack>
  );
};

export default CheckboxWithLabel;
