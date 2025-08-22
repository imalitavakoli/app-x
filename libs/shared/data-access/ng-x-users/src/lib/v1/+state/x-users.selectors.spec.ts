import { ItemsEntity } from '../items.interfaces';
import {
  itemsAdapter,
  ItemsPartialState,
  initialItemsState,
} from './items.reducer';
import * as ItemsSelectors from './items.selectors';

describe('Items Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getItemsId = (it: ItemsEntity) => it.id;
  const createItemsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    }) as ItemsEntity;

  let state: ItemsPartialState;

  beforeEach(() => {
    state = {
      items: itemsAdapter.setAll(
        [
          createItemsEntity('PRODUCT-AAA'),
          createItemsEntity('PRODUCT-BBB'),
          createItemsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialItemsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('Items Selectors', () => {
    it('selectAllEntities() should return the list of Items', () => {
      const results = ItemsSelectors.selectAllEntities(state);
      const selId = getItemsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectSelectedEntity() should return the selected Entity', () => {
      const result = ItemsSelectors.selectSelectedEntity(state) as ItemsEntity;
      const selId = getItemsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectItemsLoaded() should return the current "loaded" status', () => {
      const result = ItemsSelectors.selectLoaded(state);

      expect(result).toBe(true);
    });

    it('selectItemsError() should return the current "error" state', () => {
      const result = ItemsSelectors.selectError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
