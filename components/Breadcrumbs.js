// /components/Breadcrumbs.js
import { useRouter } from 'next/router';

export default function Breadcrumbs() {
  const router = useRouter();
  const pathSegments = router.pathname.split('/').filter((segment) => segment);

  return (
    <nav className="text-text px-6 py-4">
      <ol className="list-reset flex space-x-2">
        <li>
          <a href="/" className="text-text">Home</a>
        </li>
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          return (
            <>
              <li key={`separator-${index}`} className="text-text">/</li>
              <li key={`breadcrumb-${index}`}>
                <a href={href} className="text-text capitalize">{segment == 'dr_analysis' ? "DR Analysis" : segment.replace(/-/g, ' ')}</a>
              </li>
            </>
          );
        })}
      </ol>
    </nav>
  );
}