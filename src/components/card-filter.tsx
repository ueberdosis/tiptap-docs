import {
  CardFilterGroup,
  CardFilterItem,
  type CardFilterProps,
  CardFilterRoot,
} from '@/components/card-filter-client';

/**
 * Filter for a `Cards` grid: `<CardFilter filters>` with `<CardFilter.Item filter>` around each
 * card, and optional `<CardFilter.Group>` around parts that hide when they have no visible item.
 * Defined outside the client module, so server code can read `CardFilter.Item` and `CardFilter.Group`.
 */
export function CardFilter(props: CardFilterProps) {
  return <CardFilterRoot {...props} />;
}

CardFilter.Item = CardFilterItem;
CardFilter.Group = CardFilterGroup;
