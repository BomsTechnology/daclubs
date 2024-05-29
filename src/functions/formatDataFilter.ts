import SearchProps from '../types/SearchProps';

export default function formatDataFilter(data: SearchProps) {
  const items = data.items.map((item) => {
    if (item.includes('variantOption')) {
      const json = JSON.parse(item);
      return `{variantOption:{name:"${json.variantOption.name}",value:"${json.variantOption.value}"}}`;
    } else {
      const vals = item.split(':');
      vals[0] = vals[0].replaceAll('"', '');
      return `${vals[0]}:${vals[1]}`;
    }
  });
  return {
    ...data,
    items,
  };
}
