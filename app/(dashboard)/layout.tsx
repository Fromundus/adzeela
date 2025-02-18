import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adzeela',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex  min-h-screen bg-[#f3f3f3]">
        <Sidebar />
        <main className="flex-1 p-5">
          <Header />
          <div className='pb-10 no-scrollbar max-h-screen h-[100vh] overflow-y-auto'>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
