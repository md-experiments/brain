import { ExternalLink } from 'lucide-react';
import { REFERENCES, refUrl } from '../model/references';

/** A reference with a link to the paper; optionally with its one-line finding. */
export default function Citation({ id, finding }: { id: string; finding?: boolean }) {
  const ref = REFERENCES[id];
  return (
    <li>
      <a href={refUrl(ref)} target="_blank" rel="noopener noreferrer">
        {ref.cite}
        <ExternalLink size={11} aria-label="opens the paper in a new tab" />
      </a>
      {finding && <span className="ref-finding">{ref.finding}</span>}
    </li>
  );
}
