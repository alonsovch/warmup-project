import React from 'react';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

import handleDate from '@/utils/handleDate';

import { FaRegTrashAlt } from 'react-icons/fa';

interface NewsItemProps {
  id: string;
  title: string;
  author: string;
  date: string;
  url: string;
  onDelete: (id: string) => void;
}

const NewsItem: React.FC<NewsItemProps> = ({
  id,
  title,
  author,
  date,
  url,
  onDelete,
}) => {
  return (
    <div className="news-item">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="news-link"
      >
        <Text className="news-title">{title}</Text>
        <Text className="news-author"> - {author} -</Text>
        <Text className="news-date">{handleDate(date)}</Text>
      </a>
      <Button onClick={() => onDelete(id)}>
        <FaRegTrashAlt />
      </Button>
    </div>
  );
};

export default NewsItem;
