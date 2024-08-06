import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './schemas/news.schema';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get() 
    async findAll() : Promise<News[]> {
        return this.newsService.findAll();
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<News> {
        return this.newsService.delete(id);
    }

    @Get('status')
    getStatus() {
        return { lastUpdate: this.newsService.getLastUpdate() };
    }

    @Post('refresh')
    async refreshNews() {
        await this.newsService.forceDataRefresh();
        return { message: 'News refreshed successfully' };
    }
}