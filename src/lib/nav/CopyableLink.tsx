import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link, { LinkProps } from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import { ReactNode, useCallback, useState } from 'react';

export interface CopyableLinkProps extends Omit<LinkProps, 'href' | 'children'> {
  href: string;
  label: ReactNode;
  copyTooltip: string;
  copiedTooltip?: string;
}

/**
 * Renders a link with an adjacent copy-to-clipboard button.
 *
 * - Navigates using MUI's `Link` (you can pass `component={RouterLink}` via props).
 * - Copies the full absolute URL (origin + href) to the clipboard.
 * - Shows a temporary "Copied!" tooltip on success.
 */
export const CopyableLink = ({
  href,
  label,
  copyTooltip,
  copiedTooltip = 'Copied!',
  ...linkProps
}: CopyableLinkProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = origin ? `${origin}${href}` : href;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch((err) => {
          console.error('Failed to copy URL to clipboard:', err);
        });
    } else {
      // Fallback: best-effort using prompt
      window.prompt('Copy URL:', fullUrl);
    }
  }, [href]);

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Link href={href} {...linkProps}>
        {label}
      </Link>
      <Tooltip title={copied ? copiedTooltip : copyTooltip}>
        <IconButton size="small" aria-label={copyTooltip} onClick={handleCopy} sx={{ ml: 0.5 }}>
          <ContentCopyIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
