import MarketingHomePage from './(marketing)/page';
import { MarketingLayout } from '../components/layouts/MarketingLayout';

export default function RootPage() {
  return (
    <MarketingLayout>
      <MarketingHomePage />
    </MarketingLayout>
  );
}
