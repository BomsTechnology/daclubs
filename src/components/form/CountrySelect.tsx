import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Adapt, Select, Sheet, SelectProps } from 'tamagui';

import COUNTRIES from '~/src/data/country.json';

type CustomSelectProps = SelectProps & {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label: string;
  width: string | number;
  error?: string;
  type: string;
};

const CountrySelect = (props: CustomSelectProps) => {
  return (
    <Select {...props} disablePreventBodyScroll>
      <Select.Trigger
        width={props.width}
        borderRadius={0}
        borderWidth={1}
        borderColor={props.error ? '$red10' : '$gray6'}
        iconAfter={props.type === 'country' ? <Ionicons name="chevron-down" /> : null}>
        <Select.Value placeholder={props.placeholder} fontWeight="600">
          {props.value}
        </Select.Value>
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          modal
          snapPoints={[80]}
          snapPointsMode="percent"
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}>
          <Sheet.Frame backgroundColor="$gray1">
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport minWidth={100}>
          <Select.Group>
            <Select.Label backgroundColor="$gray1">{props.label}</Select.Label>
            {useMemo(
              () =>
                COUNTRIES.map((item, i) => {
                  return (
                    <Select.Item
                      backgroundColor="$gray1"
                      index={i}
                      key={`${item.name}-${i}-${item.code}`}
                      value={props.type === 'country' ? item.name : item.dialCode}>
                      <Select.ItemText>
                        {props.type === 'country' ? item.name : `${item.name} (${item.dialCode})`}
                      </Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Ionicons name="checkmark" size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [COUNTRIES]
            )}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
};

export default CountrySelect;
