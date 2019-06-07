/**
 * master file for all types in project
 */

import {
    AlbumEntity,
    ArtistEntity,
    ProfileEntity,
    ReviewEntity,
} from '../entities/entities';

export enum Gender {
    Male,
    Female
}

export enum ApiService {
    Spotify
}

export type RymDatabaseEntities =
    | AlbumEntity
    | ArtistEntity
    | ProfileEntity
    | ReviewEntity;

export type SpotifyDatabaseEntities =
    | AlbumEntity
    | ArtistEntity;

/**
 * Spotify API types/interfaces, WIP
 * See https://developer.spotify.com/documentation/web-api/reference/object-model/
 */

export type SpotifyRequestMethod =
    | 'GET'
    | 'POST';

export type SpotifySearchType =
    | 'album'
    | 'artist'
    | 'playlist'
    | 'track';

export type SpotifyAlbumType =
    | 'album'
    | 'single'
    | 'compilation';

export interface SpotifyClientCredentials {
    id: string;
    secret: string;
}

export interface SpotifyImage {
    height: number;
    url: string;
    width: number;
}

export interface SpotifyArtistSimplified {
    href: string;
    id: string;
    name: string;
    type: 'artist';
    uri: string;
}

export interface SpotifyArtist extends SpotifyArtistSimplified{
    genres: string[];
    images: SpotifyImage[];
    name: string;
    popularity: number;
}

export interface SpotifyAlbumSimplified {
    album_type: SpotifyAlbumType;
    artists: SpotifyArtistSimplified[];
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    type: 'album';
    uri: string;
}

export interface SpotifySearchAlbum {
    albums: {
        href: string;
        items: SpotifyAlbumSimplified[];
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
    };
}

export interface SpotifySearchArtist {
    artists: {
        href: string;
        items: SpotifyArtist[];
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
    };
}

export type SpotifySearchResponse =
    | SpotifySearchAlbum
    | SpotifySearchArtist;

export type SpotifyResponse =
    | SpotifySearchResponse;

export interface SpotifyAlbumArtistPairSimplified {
    album: SpotifyAlbumSimplified;
    artist: SpotifyArtistSimplified;
}
