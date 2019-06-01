/**
 * @fileOverview Manages scraping and storage of a single album on Rate Your Music
 *
 * @author  Michael Darr
 */

// internal class dependencies
import { requestRawScrape } from '../helpers/scraping';
import { ScrapeResult, ResultBatch } from '../result';
import Log from '../logger';

// database dependencies
import AlbumEntity from '../entity/Album';
import ArtistEntity from '../entity/Artist';
import ProfileEntity from '../entity/Profile';

export default abstract class AbstractScraper {
    public results: ResultBatch;

    public url: string;

    public scrapeContentDescription: string;

    public verbose: boolean;

    public dataReadFromDB: boolean;

    public databaseID: number;

    public scrapeSucceeded: boolean;

    public constructor(
        url: string,
        scrapeContentDescription: string,
        verbose?: boolean,
    ) {
        this.url = url;
        this.verbose = verbose || false;
        this.scrapeContentDescription = scrapeContentDescription;
        this.results = new ResultBatch();
        this.dataReadFromDB = false;
        this.scrapeSucceeded = false;
    }

    public async scrape(): Promise<void> {
        let saved = await this.getEntity();
        if(saved) {
            this.dataReadFromDB = true;
            this.databaseID = saved.id;
            this.results.push(new ScrapeResult(true, this.url));
            this.scrapeSucceeded = true;
            return;
        }
        const root: HTMLElement = await requestRawScrape(this.url);
        this.extractInfo(root);
        await this.scrapeDependencies();

        saved = await this.saveToDB();
        this.databaseID = saved.id;
        this.results.push(new ScrapeResult(true, this.url));
        this.scrapeSucceeded = true;
    }

    public printResult(): void {
        if(this.scrapeSucceeded === false) {
            Log.err(`Scrape failed for album url:\n${this.url}`);
        } else if(this.dataReadFromDB) {
            Log.success(
                `Scrape unnecessary, record exists in database\nURL: ${this.url}\nID: ${this.databaseID}`,
            );
        } else {
            Log.success(
                `Scrape successful\nURL: ${this.url}\nID: ${this.databaseID}`,
            );
        }
    }

    protected abstract extractInfo(root: HTMLElement): void;

    protected abstract async scrapeDependencies(): Promise<void>;

    protected abstract async saveToDB(): Promise<AlbumEntity | ArtistEntity | ProfileEntity>;

    public abstract printInfo(): void;

    public abstract getEntity(): Promise<AlbumEntity | ArtistEntity | ProfileEntity>;
}
