import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="bg-background min-h-screen text-text">
        <Navbar />
        <Breadcrumbs />
        <main className="p-6">
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  );
}
