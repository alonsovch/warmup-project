import React from 'react';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

import handleDate from '@/utils/handleDate';

import { FaRegTrashAlt } from 'react-icons/fa';

import { GoTrash } from 'react-icons/go';

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
        <div className="news-item-container">
          <div>
            <Text className="news-title">{title}</Text>
            <Text className="news-author"> - {author} -</Text>
          </div>
          <Text className="news-date">{handleDate(date)}</Text>
        </div>
      </a>
      <Button onClick={() => onDelete(id)}>
        <GoTrash size={20} />
      </Button>
    </div>
  );
};

export default NewsItem;
