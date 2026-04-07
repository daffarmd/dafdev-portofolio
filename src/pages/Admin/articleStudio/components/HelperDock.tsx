import type { ChangeEvent } from 'react';
import { Copy, Download, FileText, Plus, Save, Upload, X } from 'lucide-react';
import type { ArticleBlock } from '../../../../types';
import { BLOCK_TYPES, DRAFT_IMPORT_ACCEPT, blockTypeLabel } from '../constants';

type HelperDockProps = {
  isSaving: boolean;
  isVisible: boolean;
  onCopyDraftMarkdown: () => Promise<void> | void;
  onExportDraftJson: () => void;
  onExportDraftMarkdown: () => void;
  onImportInputChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => Promise<void> | void;
  onPersistDraft: () => Promise<void> | void;
  onReopen: () => void;
  onToggleVisibility: () => void;
  onAddBlock: (type: ArticleBlock['type']) => void;
};

const HelperDock = ({
  isSaving,
  isVisible,
  onCopyDraftMarkdown,
  onExportDraftJson,
  onExportDraftMarkdown,
  onImportInputChange,
  onPersistDraft,
  onReopen,
  onToggleVisibility,
  onAddBlock,
}: HelperDockProps) => {
  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={onReopen}
        className="studio-medium-helper-reopen"
      >
        <Plus className="h-4 w-4" />
        Open writing helper
      </button>
    );
  }

  return (
    <div className="studio-medium-helper-dock">
      <button
        type="button"
        onClick={onToggleVisibility}
        className="studio-medium-helper-close"
        aria-label="Hide writing helper"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="studio-medium-helper-copy">
        <p className="studio-medium-helper-title">
          Use the center canvas to write, then open Library or Settings from
          the top bar.
        </p>
        <p className="studio-medium-helper-subtitle">
          The bottom shortcuts help you add new blocks without leaving the
          writing flow.
        </p>
      </div>

      <div className="studio-medium-helper-actions">
        {BLOCK_TYPES.map((type) => (
          <button
            key={`dock-${type}`}
            type="button"
            onClick={() => onAddBlock(type)}
            className="studio-medium-helper-action"
          >
            <Plus className="h-3.5 w-3.5" />
            {blockTypeLabel[type]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void onPersistDraft()}
          disabled={isSaving}
          className="studio-medium-helper-action studio-medium-helper-action-primary"
        >
          <Save className="h-3.5 w-3.5" />
          Save draft
        </button>
        <button
          type="button"
          onClick={onExportDraftJson}
          className="studio-medium-helper-action"
        >
          <Download className="h-3.5 w-3.5" />
          Draft JSON
        </button>
        <button
          type="button"
          onClick={onExportDraftMarkdown}
          className="studio-medium-helper-action"
        >
          <FileText className="h-3.5 w-3.5" />
          Draft Markdown
        </button>
        <button
          type="button"
          onClick={() => void onCopyDraftMarkdown()}
          className="studio-medium-helper-action"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy Markdown
        </button>
        <label className="studio-medium-helper-action cursor-pointer">
          <Upload className="h-3.5 w-3.5" />
          Import MD / JSON
          <input
            type="file"
            accept={DRAFT_IMPORT_ACCEPT}
            className="hidden"
            onChange={(event) => void onImportInputChange(event)}
          />
        </label>
      </div>
    </div>
  );
};

export default HelperDock;
