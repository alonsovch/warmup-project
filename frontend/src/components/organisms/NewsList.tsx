'use client';

import React, { useEffect, useState } from 'react';
import { fetchNews, deleteNews } from '../../services/newsService';
import NewsItem from '../molecules/NewsItem';

interface NewsItemProps {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
  url: string;
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItemProps[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error loading news:', error);
      }
    };

    loadNews();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteNews(id);
      setNews(news.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  return (
    <div className="news-list">
      {news.map((item) => (
        <NewsItem
          key={item._id}
          id={item._id}
          title={item.title}
          author={item.author}
          date={item.createdAt}
          url={item.url}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default NewsList;
