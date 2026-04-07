import {
  Bell,
  Eye,
  Moon,
  MoreHorizontal,
  PanelLeft,
  Settings2,
  Sun,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type TopBarProps = {
  avatarInitials: string;
  canPreview: boolean;
  darkMode: boolean;
  isSaving: boolean;
  previewPath: string;
  publishLabel: string;
  saveStateLabel: string;
  storyStateLabel: string;
  storyStatusClassName: string;
  onExportLibrary: () => void;
  onPreviewRouteClick: () => void;
  onPublish: () => void;
  onToggleLibrary: () => void;
  onToggleSettings: () => void;
  onToggleTheme: () => void;
};

const TopBar = ({
  avatarInitials,
  canPreview,
  darkMode,
  isSaving,
  previewPath,
  publishLabel,
  saveStateLabel,
  storyStateLabel,
  storyStatusClassName,
  onExportLibrary,
  onPreviewRouteClick,
  onPublish,
  onToggleLibrary,
  onToggleSettings,
  onToggleTheme,
}: TopBarProps) => (
  <header className="studio-medium-topbar studio-medium-topbar-compact">
    <div className="studio-medium-topbar-left">
      <Link to="/admin/articles" className="studio-medium-brand">
        <span className="studio-medium-brand-wordmark">Daf.Dev</span>
      </Link>

      <div className="studio-medium-topbar-meta">
        <span className={`studio-medium-draft-label ${storyStatusClassName}`}>
          {storyStateLabel}
        </span>
        <span className="studio-medium-topbar-meta-copy">{saveStateLabel}</span>
      </div>
    </div>

    <div className="studio-medium-toolbar">
      {canPreview ? (
        <Link
          to={previewPath}
          onClick={onPreviewRouteClick}
          className="studio-medium-icon-button"
          aria-label="Preview story"
        >
          <Eye className="h-4 w-4" />
        </Link>
      ) : null}
      <button
        type="button"
        onClick={onToggleLibrary}
        className="studio-medium-icon-button"
        aria-label="Toggle story library"
      >
        <PanelLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onToggleSettings}
        className="studio-medium-icon-button"
        aria-label="Toggle story settings"
      >
        <Settings2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={isSaving}
        className="studio-medium-publish-button studio-medium-publish-button-compact"
      >
        {publishLabel}
      </button>
      <button
        type="button"
        onClick={onExportLibrary}
        className="studio-medium-icon-button"
        aria-label="Export story library"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onToggleTheme}
        className="studio-medium-icon-button"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <button
        type="button"
        className="studio-medium-icon-button"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
      </button>
      <div className="studio-medium-avatar studio-medium-avatar-compact">
        <span className="studio-medium-avatar-mark">{avatarInitials}</span>
      </div>
    </div>
  </header>
);

export default TopBar;
