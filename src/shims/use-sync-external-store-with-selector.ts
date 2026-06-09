import { useRef, useSyncExternalStore } from 'react';

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: (() => Snapshot) | undefined | null,
  selector: (snapshot: Snapshot) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean,
): Selection {
  const lastSelectionRef = useRef<Selection>(undefined as unknown as Selection);
  const hasSelectionRef = useRef(false);

  const getSelectedSnapshot = () => {
    const nextSelection = selector(getSnapshot());
    if (hasSelectionRef.current) {
      const same = isEqual ? isEqual(lastSelectionRef.current, nextSelection) : Object.is(lastSelectionRef.current, nextSelection);
      if (same) return lastSelectionRef.current;
    }
    hasSelectionRef.current = true;
    lastSelectionRef.current = nextSelection;
    return nextSelection;
  };

  const getSelectedServerSnapshot = getServerSnapshot
    ? () => selector(getServerSnapshot())
    : getSelectedSnapshot;

  return useSyncExternalStore(subscribe, getSelectedSnapshot, getSelectedServerSnapshot);
}

const exported = {
  useSyncExternalStoreWithSelector,
};

export default exported;
