import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { News } from './schemas/news.schema';
import { CronExpression } from '@nestjs/schedule';

@Injectable()
export class NewsService {
    private readonly logger = new Logger(NewsService.name);

    constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron() {
        this.logger.debug('Fetching latests news from Hacker News');
        const response = await axios.get('https://hn.algolia.com/api/v1/search_by_date?query=nodejs');
        const newsItems = response.data.hits.map(hit => ({
            title: hit.title,
            url: hit.url,
            createdAt: new Date(hit.created_at),
        }))

        for (const newsItem of newsItems) {
            const exists = await this.newsModel.exists({ url: newsItem.url, deleted: false });
            if (exists) {
                await new this.newsModel(newsItem).save();
            }
        }

        this.logger.debug(`Fetched ${newsItems.length} news items and saved to the database`);
    }

    async findAll() {
        return this.newsModel.find({ deleted: false }).sort({ createdAt: -1 }).exec();
    }

    async delete(id: string): Promise<News>{
        return this.newsModel.findByIdAndUpdate(id, { deleted: true}, { new: true}).exec();
    }
}
