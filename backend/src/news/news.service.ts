import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { News } from './schemas/news.schema';
import { NewsHit, NewsItem } from './news.types';

@Injectable()
export class NewsService implements OnModuleInit {
  private readonly logger = new Logger(NewsService.name);
  private lastUpdate: Date | null = null;

  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async onModuleInit() {
    await this.loadInitialData();
    this.handleCron();
  }

  private async fetchNewsData(url: string): Promise<NewsItem[]> {
    this.logger.debug(`Fetching news from URL: ${url}`);
    try {
      const response = await axios.get(url);
      return response.data.hits
        .map((hit: NewsHit) => ({
          title: hit.story_title || hit.title || null,
          url: hit.story_url || hit.url || null,
          author: hit.author || 'Unknown',
          createdAt: new Date(hit.created_at) || new Date(),
        }))
        .filter(
          (newsItem: NewsItem) =>
            newsItem.url !== null && newsItem.title !== null,
        );
    } catch (error) {
      this.logger.error('Error fetching news', error.stack);
      return [];
    }
  }

  private async updateNews(newsItems: NewsItem[]) {
    if (newsItems.length === 0) {
      this.logger.debug('No news items to update');
      return;
    }

    try {
      const bulkOps = newsItems.map((newsItem) => ({
        updateOne: {
          filter: { url: newsItem.url },
          update: { $setOnInsert: newsItem },
          upsert: true,
        },
      }));

      const result = await this.newsModel.bulkWrite(bulkOps, {
        ordered: false,
      });

      if (result.upsertedCount > 0) {
        this.logger.debug(
          `Fetched ${result.upsertedCount} news items and saved to the database`,
        );
      } else {
        this.logger.debug('No new news items to save');
      }

      this.lastUpdate = new Date();
    } catch (error) {
      this.logger.error('Error updating news', error.stack);
    }
  }

  async loadInitialData() {
    const url =
      'https://hn.algolia.com/api/v1/search_by_date?query=nodejs&hitsPerPage=500';
    const newsItems = await this.fetchNewsData(url);
    await this.updateNews(newsItems);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const url = 'https://hn.algolia.com/api/v1/search_by_date?query=nodejs';
    const newsItems = await this.fetchNewsData(url);
    await this.updateNews(newsItems);
  }

  async findAll() {
    return this.newsModel
      .find({ deleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async delete(id: string): Promise<News> {
    return this.newsModel
      .findByIdAndUpdate(id, { deleted: true }, { new: true })
      .exec();
  }

  getLastUpdate(): Date | null {
    return this.lastUpdate;
  }

  async dropDatabase() {
    await this.newsModel.deleteMany({}).exec();
  }

  async undoDeletes() {
    await this.newsModel
      .updateMany({ deleted: true }, { deleted: false })
      .exec();
  }
}
