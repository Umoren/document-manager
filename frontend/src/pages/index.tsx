import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Categories from '@/components/categories/categories';
import Header from '@/components/layout/header';
import { permitState } from '@/lib/permit';
import { fetchCategories } from '@/lib/utils';
import type { ApiCategory, Category } from '@/types';

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadData = async () => {
      if (!isLoaded || !user) return;

      try {
        const data: ApiCategory[] = await fetchCategories(user.id);
        // Only add icon, keep documentCount from API
        const transformedCategories: Category[] = data.map(category => ({
          ...category,
          icon: 'Folder'
        }));
        setCategories(transformedCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, isLoaded]);


  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <Header
        userName={`${user?.firstName} ${user?.lastName}`}
        userAvatar={user?.imageUrl}
      />
      <Categories
        categories={categories}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}