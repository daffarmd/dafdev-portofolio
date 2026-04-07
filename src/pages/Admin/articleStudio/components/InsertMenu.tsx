import { Plus } from 'lucide-react';
import type { ArticleBlock } from '../../../../types';
import { BLOCK_TYPES, blockTypeLabel } from '../constants';

type InsertMenuProps = {
  anchorId: string | 'start';
  isOpen: boolean;
  afterBlockId: string | null;
  onInsertBlock: (
    afterBlockId: string | null,
    type: ArticleBlock['type'],
  ) => void;
};

const InsertMenu = ({
  anchorId,
  isOpen,
  afterBlockId,
  onInsertBlock,
}: InsertMenuProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="studio-medium-insert-menu">
      {BLOCK_TYPES.map((type) => (
        <button
          key={`${anchorId}-${type}`}
          type="button"
          onClick={() => onInsertBlock(afterBlockId, type)}
          className="studio-medium-insert-menu-button"
        >
          <Plus className="h-3.5 w-3.5" />
          {blockTypeLabel[type]}
        </button>
      ))}
    </div>
  );
};

export default InsertMenu;
